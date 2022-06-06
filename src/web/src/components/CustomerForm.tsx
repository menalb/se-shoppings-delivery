import { useEffect, useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Customer } from "../model";
import './CustomerForm.css'

interface CustomerFormprops {
    customer: Customer,
    handleChange: (event: React.ChangeEvent<any>) => void,
    handleSubmit: (customer: Customer) => void,
};

const CustomerForm = (props: CustomerFormprops) => {
    const [customer, setCustomer] = useState(props.customer);
    const [errors, setErrors] = useState(new Map<string, string>());

    const handleChange = (event: React.ChangeEvent<any>) => {

        const { target } = event;
        const { name } = target;
        const value = name === "standby" || name === "homeDelivery" ? target.checked : target.value;

        setCustomer({
            ...customer,
            [name]: value,
        });

        if (errors.has(name)) {
            errors.delete(name);
            setErrors(errors);
        }
        props.handleChange(event);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const newErrors = findFormErrors()
        if (newErrors.size > 0) {
            setErrors(newErrors);
            return;
        }

        props.handleSubmit(customer);
    }

    const findFormErrors = (): Map<string, string> => {

        let newErrors: Map<string, string> = new Map<string, string>();
        // name errors
        if (!customer.name || customer.name === '') newErrors.set('name', 'Nome non inserito');
        else if (customer.name.length > 50) newErrors.set('name', 'Nome troppo lungo');

        return newErrors
    }

    useEffect(() => {
        setCustomer(props.customer);
    }, [props.customer])

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group id="name">
                <Form.Label>Nome</Form.Label>
                <Form.Control name="name" onChange={handleChange} value={customer.name} type="text" required
                    isInvalid={errors.has('name')}
                />
                <Form.Control.Feedback type='invalid'>
                    {errors.get('name')}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group id="code">
                <Form.Label>Tessera</Form.Label>
                <Form.Control name="code" onChange={handleChange} value={customer.code} type="number" />
            </Form.Group>
            <Form.Group id="area">
                <Form.Label>Zona</Form.Label>
                <Form.Control name="area" onChange={handleChange} value={customer.area} type="text" />
            </Form.Group>
            <Form.Group id="reference">
                <Form.Label>Referente</Form.Label>
                <Form.Control name="reference" onChange={handleChange} value={customer.reference} type="text" />
            </Form.Group>
            <Form.Group id="homeDelivery">
                <Form.Label>Viene lui</Form.Label>
                <Form.Check name="homeDelivery" onChange={handleChange} checked={customer.homeDelivery} type="switch" />
            </Form.Group>
            <Form.Group id="address">
                <Form.Label>Indirizzo</Form.Label>
                <Form.Control name="address" onChange={handleChange} value={customer.address} type="text" />
            </Form.Group>
            <Form.Group id="phone">
                <Form.Label>Telefono</Form.Label>
                <Form.Control name="phone" onChange={handleChange} value={customer.phone} type="text" />
            </Form.Group>
            <Form.Group id="familyStructure">
                <Form.Label>Componenti Famiglia</Form.Label>
                <Form.Control name="familyStructure" onChange={handleChange} value={customer.familyStructure} type="text" />
            </Form.Group>
            <Form.Group id="adults">
                <Form.Label>Adulti</Form.Label>
                <Form.Control name="adults" onChange={handleChange} value={customer.adults} type="number" />
            </Form.Group>
            <Form.Group id="children">
                <Form.Label>Bambini</Form.Label>
                <Form.Control name="children" onChange={handleChange} value={customer.children} type="number" />
            </Form.Group>
            <Form.Group id="note">
                <Form.Label>Richieste Particolari</Form.Label>
                <Form.Control name="note" as="textarea" onChange={handleChange} value={customer.note} type="text" />
            </Form.Group>
            <Form.Group id="linkMaps">
                <Form.Label>GoogleMaps link</Form.Label>
                <Form.Control name="linkMaps" onChange={handleChange} value={customer.linkMaps} type="text" />
            </Form.Group>
            <Form.Group id="standby">
                <Form.Label>Stand By</Form.Label>                
                <Form.Check name="standby" onChange={handleChange} checked={customer.standby ? customer.standby : false} type="switch" />
            </Form.Group>
            <hr />
            <Button className="w-100" type="submit">
                Salva
            </Button>
        </Form>);
}

export default CustomerForm;