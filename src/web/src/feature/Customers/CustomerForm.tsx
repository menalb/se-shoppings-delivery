import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Customer } from "./model";

import './CustomerForm.css'
import { formatDateCalendar } from "../../model";
import { useCheckMobileScreen } from "../../services/utils";
import { ActionComponentProps, LinkComponentProps, SaveCancelButtonsComponent, SecondaryLinkComponent } from "../ActionButtons";

interface CustomerFormProps {
    customer: Customer,
    disabled: boolean,
    handleChange: (event: React.ChangeEvent<any>) => void,
    handleSubmit: (customer: Customer) => void,
    buttons: {
        cancel: LinkComponentProps,
        submit: ActionComponentProps
    }
};

const CustomerForm = (props: CustomerFormProps) => {
    const [customer, setCustomer] = useState(props.customer);
    const [errors, setErrors] = useState(new Map<string, string>());
    const isMobile = useCheckMobileScreen();

    const handleChange = (event: React.ChangeEvent<any>) => {

        const { target } = event;
        const { name } = target;
        let value = name === "standby" || name === "homeDelivery"
            ? target.checked : target.value;

        value = name === 'documentationDeliveredOn' ?
            target.value !== '' ? new Date(target.value) : undefined :
            value;

        value = name === 'birthDay' ? (target.value !== '' ? new Date(target.value) : undefined) : value;

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

    const resetDateField = (fieldName: string) => {
        setCustomer({
            ...customer,
            [fieldName]: undefined,
        });
    }

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
                <h2 className="text-center mb-4">
                    {!isMobile &&
                        <SecondaryLinkComponent {...props.buttons.cancel} />
                    }
                    {customer.name}
                    {!isMobile &&
                        <Button
                            type="submit"
                            title={props.buttons.submit.title}>
                            {props.buttons.submit.text}
                        </Button>
                    }
                </h2>
                <fieldset className="content" disabled={props.disabled}>
                    <Form.Group controlId="name" as={Row} className="mb-3" >
                        <Form.Label column xs={4} lg={2} xl={2}>Nome</Form.Label>
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
                        <Form.Label column xs={4} lg={2} xl={2}>Zona</Form.Label>
                        <Col xs={8} lg={4} xl={4}>
                            <Form.Control name="area" onChange={handleChange} value={customer.area} type="text" />
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="reference" as={Row} className="mb-3" >
                        <Form.Label column xs={4} lg={2} xl={2} title="Referente">Referente</Form.Label>
                        <Col xs={8} lg={4} xl={4}>
                            <Form.Control name="reference" onChange={handleChange} value={customer.reference} type="text" />
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="address" as={Row} className="mb-3" >
                        <Form.Label column xs={4} lg={2} xl={2}>Indirizzo</Form.Label>
                        <Col xs={8} lg={4} xl={6}>
                            <Form.Control name="address" onChange={handleChange} value={customer.address} type="text" />
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="phone" as={Row} className="mb-3" >
                        <Form.Label column xs={4} lg={2} xl={2}>Telefono</Form.Label>
                        <Col xs={8} lg={4} xl={2}>
                            <Form.Control name="phone" onChange={handleChange} value={customer.phone} type="text" />
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="familyMembers" as={Row} className="mb-3" >
                        <Form.Label column xs={4} lg={2}>Componenti Famiglia</Form.Label>
                        <Col xs={4} lg={2} xl={1}>
                            <Form.Control name="familyMembers" onChange={handleChange} value={customer.familyMembers} type="number" />
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="familyStructure" as={Row} className="mb-3" >
                        <Col xs={12}>
                            <Form.Control name="familyStructure" onChange={handleChange} value={customer.familyStructure} type="text" />
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="note" as={Row} className="mb-3" >
                        <Form.Label column xs={12}>Richieste Particolari</Form.Label>
                        <Col xs={12}>
                            <Form.Control name="note" as="textarea" onChange={handleChange} value={customer.note} type="text" />
                        </Col>
                    </Form.Group>

                    <Form.Group controlId="birthDay" as={Row} className="mb-3" >
                        <Form.Label column xs={12} lg={2}>Compleanno</Form.Label>
                        <Col xs={8} lg={4}>
                            <Form.Control
                                name="birthDay"
                                onChange={handleChange}
                                value={customer.birthDay ? formatDateCalendar(customer.birthDay) : ''}
                                type="date" />
                        </Col>
                        <Col xs={2} lg={4}>
                            <Button className="btn-secondary" title="Azzera compleanno" onClick={(e) => resetDateField('birthDay')}>X</Button>
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="documentationDeliveryDate" as={Row} className="mb-3" >
                        <Form.Label column xs={12} lg={2}>Data consegna ISEE</Form.Label>
                        <Col xs={8} lg={4}>
                            <Form.Control
                                name="documentationDeliveredOn"
                                onChange={handleChange}
                                value={customer.documentationDeliveredOn ? formatDateCalendar(customer.documentationDeliveredOn) : ''}
                                type="date" />
                        </Col>
                        <Col xs={2} lg={4}>
                            <Button className="btn-secondary" title="Azzera data consegna ISEE" onClick={(e) => resetDateField('documentationDeliveredOn')}>X</Button>
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="linkMaps" as={Row} className="mb-3" >
                        <Form.Label column xs={12} lg={2}>GoogleMaps link</Form.Label>
                        <Col xs={10} lg={8}>
                            <Form.Control name="linkMaps" onChange={handleChange} value={customer.linkMaps} type="text" />
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="standby" as={Row} className="mb-3" >
                        <Form.Label column xs={4} lg={2} xl={2}>Stand By</Form.Label>
                        <Col xs={6} lg={2} xl={2}><Form.Check name="standby" onChange={handleChange} checked={customer.standby ? customer.standby : false} type="switch" /></Col>
                    </Form.Group>

                </fieldset>
                {isMobile &&
                    <SaveCancelButtonsComponent
                        cancel={props.buttons.cancel}
                        submit={props.buttons.submit}
                    />}
            </Form>
        </>);
}

export default CustomerForm;