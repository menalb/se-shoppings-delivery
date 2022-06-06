import { useEffect, useState } from "react";
import { Alert, Card, Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { Customer } from "../model";
import { Loader } from "./Loader";
import './EditCustomerPage.css';
import { getCustomer } from "../services/customers-query";
import { updateCustomer } from "../services/customer-command";
import CustomerForm from "./CustomerForm";
import { ListButton } from "./Buttons";

function EditCustomerPage() {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState({} as Customer)
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUpdateOk, setIsUpdateOk] = useState(false);
    const [error, setError] = useState("")

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
            <div className="buttons">
                <ListButton></ListButton>
            </div>

            <Loader isLoading={isLoading || isUpdating}></Loader>
            {customer.standby ? <div className="standby">Attenzione: Attualmente in Stand By</div> : ''}
            {isLoading ? '' :
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">{customer.name}</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {isUpdateOk ?
                            <p className="update-ok">
                                <em>Aggiornameto completato con successo</em>
                            </p> : ''}
                        <CustomerForm customer={customer} handleSubmit={handleSubmit} handleChange={handleChange} disabled={isUpdating}></CustomerForm>
                    </Card.Body>
                </Card>
            }
        </>
    )
}

export default EditCustomerPage;
