import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { Customer, CustomerDelivery } from "../model";
import { Loader } from "./Loader";
import { getCustomer } from "../services/customers-query";
import { useAuth } from "../context/AuthContext";
import { CustomerDeliveryModal } from "./delivery/CustomerDeliveryModal";
import { CustomerDeliveriesComponent } from "./CustomerDeliveriesComponent";

import './CustomerPage.css';

function CustomerPage() {
    const { customerId } = useParams();

    const emptyCustomerDelivery: CustomerDelivery = {
        deliveryId: '',
        customerId: customerId ?? '',
        note: '',
        deliveredBy: '',
        deliveryDate: new Date(Date.now())
    };

    const [customer, setCustomer] = useState({} as Customer)
    const { currentUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [deliveryToEdit, setDeliveryToEdit] = useState(emptyCustomerDelivery);

    const [deliveryShow, setDeliveryShow] = useState(false);

    const fetchCustomer = async () => {
        if (customerId) {
            setIsLoading(true);

            const customer = await getCustomer(customerId);
            if (customer.kind === 'customer') {
                setCustomer(customer);
            }

            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCustomer();
    }, [customerId]);

    const onSave = () => {
        fetchCustomer();
        setDeliveryToEdit(emptyCustomerDelivery);
        setDeliveryShow(false)
    }

    const deliveryClick = (cd: CustomerDelivery) => {
        setDeliveryToEdit(cd);
        setDeliveryShow(true);
    }

    return (
        <>
            <Loader isLoading={isLoading}></Loader>

            {isLoading ? '' :
                <Card className="customer-page">
                    <Card.Body>
                        <h2 className="text-lg-center mb-4">
                            <span>
                                {customer.name}
                            </span>
                            <span className="buttons">
                                {currentUser ? <>
                                    <Button variant="primary" onClick={() => setDeliveryShow(true)}>
                                        <span className="button-name">
                                            Consegna
                                        </span>
                                    </Button>

                                    <CustomerDeliveryModal
                                        show={deliveryShow}
                                        onHide={() => setDeliveryShow(false)}
                                        onSave={onSave}
                                        customerId={customerId ?? ''}
                                        delivery={deliveryToEdit}
                                    />
                                </>
                                    : ''
                                }
                            </span>
                        </h2>
                        {customer.standby ? <div className="standby">Attenzione: Attualmente in Stand By</div> : ''}
                        <Container className="content">
                            <Row>
                                Tessera
                            </Row>
                            <Row>
                                {customer.code ? <b>{customer.code}</b> : <em>tessera non assegnata</em>}
                            </Row>
                            <Row>
                                Zona
                            </Row>
                            <Row>
                                <b>{customer.area}</b>
                            </Row>
                            <Row>
                                Referente
                            </Row>
                            <Row>
                                <b>{customer.reference}</b>
                            </Row>
                            <Row>
                                Viene lui
                            </Row>
                            <Row>
                                <b>{!!customer.homeDelivery ? 'SI' : 'NO'}</b>
                            </Row>
                            <Row>
                                Indirizzo
                            </Row>
                            <Row>
                                <b>
                                    {customer.linkMaps ?
                                        <a title="indirizzo, fare click per aprire la mappa" href={customer.linkMaps}>{customer.address}</a>
                                        :
                                        customer.address
                                    }
                                </b>
                            </Row>
                            <Row>
                                Telefono
                            </Row>
                            <Row>
                                {customer.phone ? <b><a title="numero di telefono, avviare la telefonata" href={'tel:' + customer.phone}>{customer.phone}</a></b> : <em>numero di telefono non disponibile</em>}
                            </Row>
                            <Row>
                                Componenti Famiglia
                            </Row>
                            <Row>
                                <b>{customer.familyStructure ? customer.familyStructure : ' '}</b>
                            </Row>
                            <Row>
                                Adulti
                            </Row>
                            <Row>
                                <b>{customer.adults ? customer.adults : ' '}</b>
                            </Row>
                            <Row>
                                Bambini
                            </Row>
                            <Row>
                                <b>{customer.children ? customer.children : ' '}</b>
                            </Row>
                            <Row>
                                Richieste Particolari
                            </Row>
                            <Row>
                                <b>{customer.note ? customer.note : ' '}</b>
                            </Row>
                            <h3 className="text-center">Consegne ({customer.deliveries ? customer.deliveries.length : 0})</h3>
                            <Row>
                                <em className="text-center">Selezionare la riga per modificare</em>
                            </Row>
                            {customer.deliveries && customer.deliveries.length > 0 ?
                                <Row><CustomerDeliveriesComponent customerDeliveries={customer.deliveries} onDeliveryClick={cd => deliveryClick(cd)} /></Row>
                                : <em>Nessuna consegna disponibile</em>
                            }
                        </Container>
                        <Container>
                            <Row className="actions-row buttons">
                                <Col className="button-action button-action-left">
                                    <Link className=" link btn btn-secondary" title="Annulla modifica e torna all'elenco" to={"/customers"}>
                                        <span className="button-name">
                                            Torna a elenco
                                        </span>
                                    </Link>
                                </Col>
                                <Col className="button-action button-action-right">
                                    <Link className=" link btn btn-primary" title="Modifica dati" to={"/edit/" + customerId}>
                                        <span className="button-name">
                                            Modifica
                                        </span>
                                    </Link>
                                </Col>
                            </Row>
                        </Container>
                    </Card.Body>
                </Card>
            }
        </>
    )
}


export default CustomerPage;