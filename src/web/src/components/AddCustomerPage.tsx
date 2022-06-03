import { useEffect, useRef, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { Customer } from "../model";
import './CustomerPage.css';
import { getCustomer } from "../services/customers-query";

function AddCustomerPage() {
    const [customer, setCustomer] = useState({} as Customer)
    const [isUpdateOk, setIsUpdateOk] = useState(false);
    const [error, setError] = useState("")

    const fetchCustomer = async () => {
    }

    async function handleSubmit(e: any) {
        e.preventDefault();


        //await updateCustomer(customer);
        setIsUpdateOk(true);

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

    // useEffect(() => {
    //     fetchCustomer();

    // }, [customerId]);

    return (
        <>
            <Link to="/customers">Elenco</Link>

            {customer.standby ? <div className="standby">Attenzione: Attualmente in Stand By</div> : ''}

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
                        <Button className="w-100" type="submit">
                            Salva
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

        </>
    )
}


export default AddCustomerPage;