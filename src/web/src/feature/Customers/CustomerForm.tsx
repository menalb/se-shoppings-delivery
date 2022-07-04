import { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Customer } from "./model";

import './CustomerForm.css'

interface CustomerFormProps {
    customer: Customer,
    disabled: boolean,
    handleChange: (event: React.ChangeEvent<any>) => void,
    handleSubmit: (customer: Customer) => void,
    SaveCancelButtons: JSX.Element
};

const CustomerForm = (props: CustomerFormProps) => {
    const [customer, setCustomer] = useState(props.customer);
    const [errors, setErrors] = useState(new Map<string, string>());

    useEffect(() => {

    }, []);

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
        <>
            <Form className="customer-form" onSubmit={handleSubmit}>
                <fieldset disabled={props.disabled}>
                    <Form.Group controlId="name" as={Row} className="mb-3" >
                        <Form.Label column xs={4} lg={2} xl={1}>Nome</Form.Label>
                        <Col xs={8} lg={4} xl={4}>
                            <Form.Control name="name" onChange={handleChange} value={customer.name} type="text" required
                                isInvalid={errors.has('name')}
                            />
                        </Col>
                        <Form.Control.Feedback type='invalid'>
                            {errors.get('name')}
                        </Form.Control.Feedback>
                    </Form.Group>                
                    <Form.Group controlId="area" as={Row} className="mb-3" >
                        <Form.Label column xs={4} lg={2} xl={1}>Zona</Form.Label>
                        <Col xs={8} lg={4} xl={4}>
                            <Form.Control name="area" onChange={handleChange} value={customer.area} type="text" />
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="reference" as={Row} className="mb-3" >
                        <Form.Label column xs={4} lg={2} xl={1} title="Referente">Referente</Form.Label>
                        <Col xs={8} lg={4} xl={4}>
                            <Form.Control name="reference" onChange={handleChange} value={customer.reference} type="text" />
                        </Col>
                    </Form.Group>            
                    <Form.Group controlId="address" as={Row} className="mb-3" >
                        <Form.Label column xs={4} lg={2} xl={1}>Indirizzo</Form.Label>
                        <Col xs={8} lg={4} xl={6}>
                            <Form.Control name="address" onChange={handleChange} value={customer.address} type="text" />
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="phone" as={Row} className="mb-3" >
                        <Form.Label column xs={4} lg={2} xl={1}>Telefono</Form.Label>
                        <Col xs={8} lg={4} xl={2}>
                            <Form.Control name="phone" onChange={handleChange} value={customer.phone} type="text" />
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="familyStructure" as={Row} className="mb-3" >
                        <Form.Label column xs={12}>Componenti Famiglia</Form.Label>
                        <Col xs={12}>
                            <Form.Control name="familyStructure" onChange={handleChange} value={customer.familyStructure} type="text" />
                        </Col>

                    </Form.Group>
                    <Form.Group controlId="adults" as={Row} className="mb-3" >
                        <Form.Label column xs={4} lg={2} xl={1}>Adulti</Form.Label>
                        <Col xs={4} lg={2} xl={1}>
                            <Form.Control name="adults" onChange={handleChange} value={customer.adults} type="number" />
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="children" as={Row} className="mb-3" >
                        <Form.Label column xs={4} lg={2} xl={1}>Bambini</Form.Label>
                        <Col xs={4} lg={2} xl={1}>
                            <Form.Control name="children" onChange={handleChange} value={customer.children} type="number" />
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="note">
                        <Form.Label>Richieste Particolari</Form.Label>
                        <Form.Control name="note" as="textarea" onChange={handleChange} value={customer.note} type="text" />
                    </Form.Group>
                    <Form.Group controlId="linkMaps">
                        <Form.Label column xs={10} >GoogleMaps link</Form.Label>
                        <Col xs={10}>
                            <Form.Control name="linkMaps" onChange={handleChange} value={customer.linkMaps} type="text" />
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="standby" as={Row} className="mb-3" >
                        <Form.Label column xs={4} lg={2} xl={1}>Stand By</Form.Label>
                        <Col xs={6} lg={4} xl={2}><Form.Check name="standby" onChange={handleChange} checked={customer.standby ? customer.standby : false} type="switch" /></Col>
                    </Form.Group>

                </fieldset>
                {props.SaveCancelButtons}
            </Form>
        </>);
}

export default CustomerForm;