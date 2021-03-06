import { useEffect, useState } from "react";
import { Alert, Button, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { Loader } from "../../Loader";
import { getCustomer } from "../services/customers-query";
import { updateCustomer } from "../services/customer-command";
import CustomerForm from "../CustomerForm";
import { SaveCancelButtonsComponent } from "../../ActionButtons";
import { Customer } from "../model";

import './EditCustomerPage.css';

const EditCustomerPage = () => {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState({} as Customer)
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUpdateOk, setIsUpdateOk] = useState(false);
    const [error, setError] = useState("")
    const navigate = useNavigate();

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


    async function handleSubmit(c: Customer) {

        setIsUpdating(true);
        try {
            if (customerId) {
                await updateCustomer(c);
                setCustomer(c);
                setIsUpdateOk(true);
                navigate(`/customer/${c.id}`);
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
            {customer.standby && <div className="standby">Attenzione: Attualmente in Stand By</div>}
            {!isLoading &&
                <Card className="edit-customer-page">
                    <Card.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {isUpdateOk &&
                            <p className="update-ok">
                                <em>Aggiornameto completato con successo</em>
                            </p>}
                        <CustomerForm
                            customer={customer}
                            handleSubmit={handleSubmit}
                            handleChange={handleChange}
                            disabled={isUpdating}                

                            buttons={
                                {
                                    cancel: { link: `/customer/${customer.id}`, text: 'Annulla', title: 'Annulla modifica e torna ai dettagli persona' },
                                    submit: { text: 'Salva', title: 'Salva modifiche persona' }
                                }
                            }
                        ></CustomerForm>

                    </Card.Body>
                </Card>
            }
        </>
    )
}

export default EditCustomerPage;
