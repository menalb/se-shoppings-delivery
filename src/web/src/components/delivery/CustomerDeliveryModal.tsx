import { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap"
import { propTypes } from "react-bootstrap/esm/Image";
import { useAuth } from "../../context/AuthContext";
import { CustomerDelivery, Delivery } from "../../model";
import { logDelivery } from "../../services/customer-command";
import { deliveriesQuery } from "../../services/delivery-query";
import { Loader } from "../Loader";

export interface CustomerDeliveryModalProps {
    onHide: () => void;
    onSave: () => void;
    show: boolean;
    customerId: string;
}



export const CustomerDeliveryModal = (props: CustomerDeliveryModalProps) => {

    const empty = {
        deliveryId: '',
        customerId: props.customerId,
        note: '',
        deliveredBy: '',
        deliveryDate: new Date(Date.now())
    };

    const { currentUser, roles } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [deliveries, setDeliveries] = useState([] as Delivery[]);
    const [customerDelivery, setCustomerDelivery] = useState(empty);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUpdateOk, setIsUpdateOk] = useState(false);
    const [error, setError] = useState("")

    const fetchDeliveries = async () => {
        setIsLoading(true);
        const deliveries = await deliveriesQuery();
        setDeliveries(deliveries);
        setIsLoading(false);
    }

    useEffect(() => {
        if (deliveries && deliveries.length > 0) {
            setCustomerDelivery({
                ...customerDelivery,
                deliveryId: deliveries[0].id,
                customerId: props.customerId,
                deliveryDate: deliveries[0].day
            });
        }
        else {
            setCustomerDelivery({ ...customerDelivery, deliveryId: '', customerId: props.customerId });
        }
    }, [deliveries])

    async function save() {

        try {
            if (currentUser) {
                await logDelivery(customerDelivery, currentUser?.uid);
                props.onSave();
            }
        }
        catch (e) {
            console.error(e);
            setError('Aggiornamento fallito');
            setIsUpdateOk(false);
        }
        setIsUpdating(false);
    }

    const handleChange = (event: React.ChangeEvent<any>) => {

        const { target } = event;
        const { name } = target;
        const value = target.value;
        let deliveryDate = customerDelivery.deliveryDate;

        if (name === 'deliveryId' && deliveries.some(d => d.id === value)) {
            deliveryDate = deliveries.find(d => d.id === value)?.day ?? deliveryDate;
        }

        setCustomerDelivery({
            ...customerDelivery,
            [name]: value,
            deliveryDate: deliveryDate
        })
    };

    const onShow = (): void => {
        setCustomerDelivery(empty);
        fetchDeliveries();
        setIsUpdating(false);
        setError('');
    }


    return (
        <Modal
            show={props.show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            onShow={onShow}
            centered>
            <Modal.Header closeButton={true} onHide={props.onHide}>
                <Modal.Title id="contained-modal-title-vcenter">
                    Consegna
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Loader isLoading={isLoading}></Loader>
                {error && <Alert variant="danger">{error}</Alert>}
                {isUpdateOk ?
                    <p className="update-ok">
                        <em>Aggiornameto completato con successo</em>
                    </p> : ''}
                <Form>
                    <Form.Group as={Row} className="mb-3" id="day">
                        <Form.Label column sm="2" xs="12">Data</Form.Label>

                        <Col sm="10" xs="12">
                            <Form.Select id="deliveryId" name="deliveryId" aria-label="Seleziona data di consegna" onChange={handleChange} value={customerDelivery.deliveryId}>
                                {deliveries.map(d => <option key={d.id} value={d.id}>{d.day.toDateString()}</option>)}
                            </Form.Select>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" id="deliveredBy">
                        <Form.Label column sm="2" xs="12">Effettuata da</Form.Label>

                        <Col sm="10" xs="12">
                            <Form.Control name="deliveredBy" onChange={handleChange} value={customerDelivery.deliveredBy} type="text" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" id="note">
                        <Form.Label column sm="2" xs="12">Note</Form.Label>

                        <Col sm="10" xs="12">
                            <Form.Control name="note" as="textarea" onChange={handleChange} value={customerDelivery.note} type="text" />
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Annulla</Button>
                <Button onClick={save}>Save</Button>
            </Modal.Footer>
        </Modal>
    )
}