import { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Delivery } from "./model";
import { formatDateCalendar, formatDeliveryCode } from "../../model";
import { SaveCancelButtonsComponent } from "../ActionButtons";
import { Customer } from "../Customers/model";
import './DeliveryForm.css'

interface DeliveryFormProps {
    delivery: Delivery,
    disabled: boolean,
    handleChange: (event: React.ChangeEvent<any>) => void,
    handleSubmit: (delivery: Delivery) => void,
};

export const DeliveryForm = (props: DeliveryFormProps) => {    
    const [delivery, setDelivery] = useState(props.delivery);
    const [errors, setErrors] = useState(new Map<string, string>());


    const handleChange = (event: React.ChangeEvent<any>) => {

        const { target } = event;
        const { name } = target;
        const value = name == 'day' ? new Date(target.value) : target.value;

        setDelivery({
            ...delivery,
            code: name === 'day' ? formatDeliveryCode(value) : delivery.code,
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

        props.handleSubmit(delivery);
    }


    const findFormErrors = (): Map<string, string> => {

        let newErrors: Map<string, string> = new Map<string, string>();

        if (!delivery.code || delivery.code === '') newErrors.set('code', 'Data non inserita');

        return newErrors
    }

    useEffect(() => {
        setDelivery(props.delivery);
    }, [props.delivery])

    return (
        <Form onSubmit={handleSubmit} className="delivery-form">
            <fieldset disabled={props.disabled}>
                <Form.Group as={Row} className="mb-3" controlId="day">
                    <Form.Label column sm="2" xs="12">Data</Form.Label>

                    <Col sm="10" xs="12">
                        <Form.Control name="day" onChange={handleChange} value={formatDateCalendar(delivery.day)} type="date" required
                            isInvalid={errors.has('day')}
                        />
                    </Col>
                    <Form.Control.Feedback type='invalid'>
                        {errors.get('day')}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="note">
                    <Form.Label column sm="2" xs="12">Note</Form.Label>

                    <Col sm="10" xs="12">
                        <Form.Control name="note" as="textarea" onChange={handleChange} value={delivery.note} type="text" />
                    </Col>
                </Form.Group>
            </fieldset>
            <SaveCancelButtonsComponent
                cancel={
                    { link: `/deliveries`, text: 'Annulla', title: `Annulla e torna alla lista dei giri` }
                }
                submit={{ text: 'Salva', title: 'Salva modifiche giro' }}
            />
        </Form>
    )
}

