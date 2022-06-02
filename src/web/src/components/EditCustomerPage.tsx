import {  useEffect, useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { Customer } from "../model";
import { Loader } from "./Loader";
import './EditCustomerPage.css';
import { getCustomer } from "../services/customers-query";
import { updateCustomer } from "../services/customer-command";

function EditCustomerPage() {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState({} as Customer)
    const [isLoading, setIsLoading] = useState(false);
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


    async function handleSubmit(e: any) {
        e.preventDefault();

        if (customerId) {
            await updateCustomer(customer);
            setIsUpdateOk(true);
        }
    }

    const handleChange = (event: React.ChangeEvent<any>) => {
        setIsUpdateOk(false);
        const { target } = event;
        const { name } = target;
        const value = name === "standby" ? target.checked : target.value;

        setCustomer({
            ...customer,
            [name]: value,
        });
    };


    return (
        <>
            <Link to="/customers">&lt;- Elenco</Link>
            <Loader isLoading={isLoading}></Loader>
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
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="name">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control name="name" onChange={handleChange} value={customer.name} type="text" required />
                            </Form.Group>
                            <Form.Group id="area">
                                <Form.Label>Zona</Form.Label>
                                <Form.Control name="area" onChange={handleChange} value={customer.area} type="text" />
                            </Form.Group>
                            <Form.Group id="address">
                                <Form.Label>Indirizzo</Form.Label>
                                <Form.Control name="address" onChange={handleChange} value={customer.address} type="text" />
                            </Form.Group>
                            <Form.Group id="phone">
                                <Form.Label>Telefono</Form.Label>
                                <Form.Control name="phone" onChange={handleChange} value={customer.phone} type="text" />
                            </Form.Group>
                            <Form.Group id="reference">
                                <Form.Label>Referente</Form.Label>
                                <Form.Control name="reference" onChange={handleChange} value={customer.reference} type="text" />
                            </Form.Group>
                            <Form.Group id="note">
                                <Form.Label>Richieste Particolari</Form.Label>
                                <Form.Control name="note" as="textarea" onChange={handleChange} value={customer.note} type="text" />
                            </Form.Group>
                            <Form.Group id="linkMaps">
                                <Form.Label>GoogleMaps link</Form.Label>
                                <Form.Control name="linkMaps" onChange={handleChange} value={customer.linkMaps} type="text" />
                            </Form.Group>
                            <Form.Group id="reference">
                                <Form.Label>Stand By</Form.Label>
                                <Form.Check
                                    type="switch"
                                    id="standby"
                                    label=""
                                    name="standby"
                                    defaultChecked={customer.standby ? customer.standby : false}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <hr />
                            <Button disabled={isLoading} className="w-100" type="submit">
                                Salva
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            }
        </>
    )
}


export default EditCustomerPage;