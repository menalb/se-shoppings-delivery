import { useState } from "react";
import { Alert, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Delivery, formatDeliveryCode } from "../model";
import { addDelivery } from "../services/delivery-command";
import { ListDeliveriesButton } from "./Buttons"
import { DeliveryForm } from "./DeliveryForm";

export const AddDeliveryPage = () => {

    const toDay = new Date(Date.now());
    const emptyDelivery: Delivery = {
        kind: 'delivery',
        id: '',
        code: formatDeliveryCode(toDay),
        day: new Date(Date.now()),
        creationDate: new Date(Date.now()),
        note: '',
    };

    const [delivery, setDelivery] = useState(emptyDelivery)
    const [isUpdateOk, setIsUpdateOk] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(d: Delivery) {

        setIsUpdating(true);
        try {
            setError("")
            await addDelivery(d);
            navigate("/deliveries");
        }
        catch (e) {
            console.error(e);
            setError('Creazione fallita');
            setIsUpdateOk(false);
        }
        setIsUpdating(false);
    }

    const handleChange = (event: React.ChangeEvent<any>) => {
        setIsUpdateOk(false);
    }


    return (
        <>
            <div className="buttons">
                <ListDeliveriesButton></ListDeliveriesButton>
            </div>

            <Card>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {isUpdateOk ?
                        <p className="update-ok">
                            <em>Aggiornameto completato con successo</em>
                        </p> : ''}
                    <DeliveryForm delivery={delivery} handleSubmit={handleSubmit} handleChange={handleChange} disabled={isUpdating}></DeliveryForm>
                </Card.Body>
            </Card>
        </>
    )
}