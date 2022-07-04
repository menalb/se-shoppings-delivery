import { useEffect, useState } from "react";
import { Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Customer } from "../model";
import { addCustomer } from "../services/customer-command";
import CustomerForm from "../CustomerForm";
import { SaveCancelButtonsComponent } from "../../ActionButtons";

const AddCustomerPage = () => {

    const [customer, setCustomer] = useState(emptyCustomer)
    const [isUpdateOk, setIsUpdateOk] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(c: Customer) {

        setIsUpdating(true);
        try {
            setError("")
            await addCustomer(c);
            navigate("/customers");
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
            {customer.standby && <div className="standby">Attenzione: Attualmente in Stand By</div>}
            <Card>
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
                        SaveCancelButtons={<SaveCancelButtonsComponent
                            cancel={
                                { link: '/customers', text: 'Annulla', title: `Annulla e torna all'elenco delle persone` }
                            }
                            submit={{ text: 'Salva', title: 'Salva nuova persona' }}
                        />}
                    ></CustomerForm>

                </Card.Body>
            </Card>

        </>
    )
}

export default AddCustomerPage;

const emptyCustomer: Customer = {
    kind: 'customer',
    id: '',
    name: '',
    area: '',
    address: '',
    code: 0,
    creationDate: new Date(Date.now()),
    familyStructure: '',
    familyMembers: 0,
    linkMaps: '',
    customerId: 0,
    note: '',
    phone: '',
    reference: '',
    homeDelivery: false,
    standby: false,
    deliveries: []
}