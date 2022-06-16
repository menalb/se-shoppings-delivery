import { useEffect, useState } from "react";
import { Alert, Card} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Delivery } from "../../model";
import { updateDelivery } from "../../services/delivery-command";
import { getDelivery } from "../../services/delivery-query";
import { Loader } from "./../Loader";
import { DeliveryForm } from "./DeliveryForm";


function EditDeliveryPage() {
    const { deliveryId } = useParams();
    const [delivery, setDelivery] = useState({} as Delivery)
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUpdateOk, setIsUpdateOk] = useState(false);
    const { currentUser, roles } = useAuth();
    const [error, setError] = useState("")

    const fetchDelivery = async () => {
        if (deliveryId) {
            setIsLoading(true);

            const delivery = await getDelivery(deliveryId);
            if (delivery.kind === 'delivery') {
                setDelivery(delivery);
            }

            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchDelivery();

    }, [deliveryId]);


    async function handleSubmit(d: Delivery) {

        setIsUpdating(true);
        try {
            if (deliveryId && currentUser) {
                await updateDelivery(d, currentUser.uid);
                setDelivery(d);
                setIsUpdateOk(true);
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
        setIsUpdateOk(false);
    };

    return (
        <>
            <Loader isLoading={isLoading || isUpdating}></Loader>
            {isLoading ? '' :
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">{delivery.code}</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {isUpdateOk ?
                            <p className="update-ok">
                                <em>Aggiornameto completato con successo</em>
                            </p> : ''}
                        <DeliveryForm delivery={delivery} handleSubmit={handleSubmit} handleChange={handleChange} disabled={isUpdating}></DeliveryForm>
                    </Card.Body>
                </Card>
            }
        </>
    )
}

export default EditDeliveryPage;
