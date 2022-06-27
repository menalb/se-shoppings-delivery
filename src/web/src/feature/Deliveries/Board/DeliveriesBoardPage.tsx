import { useEffect, useState } from "react";
import { Col, Form, ListGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context";
import { CustomerDelilveryDay, customersQueryByDelivery } from "../../Customers";
import { Loader } from "../../Loader";
import { Delivery } from "../model";
import { deliveriesQuery } from "../services/delivery-query";
import './DeliveriesBoardPage.css'

const DeliveriesBoardPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { currentUser, roles } = useAuth();
    const [deliveries, setDeliveries] = useState([] as Delivery[]);

    const [customers, setCustomers] = useState([] as CustomerDelilveryDay[]);

    const fetchCustomersAndDeliveries = async (deliveryId: string) => {
        setIsLoading(true);

        const customers = await customersQueryByDelivery(deliveryId);

        setCustomers(customers);
        setIsLoading(false);
    }

    const fetchDeliveries = async () => {
        setIsLoading(true);
        const deliveries = await deliveriesQuery();
        setDeliveries(deliveries);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchDeliveries();
    }, [currentUser]);

    useEffect(() => {
        if (deliveries.length > 0) {
            fetchCustomersAndDeliveries(deliveries[0].id);
        }
    }, [deliveries]);

    const handleChange = (event: React.ChangeEvent<any>) => {
        fetchCustomersAndDeliveries(event.target.value);
    }

    return (<>
        <Form>
            <Form.Group as={Row} className="mb-3" controlId="day">
                <Form.Label column sm="2" xs="12">Data</Form.Label>

                <Col sm="10" xs="12">
                    <Form.Select name="deliveryId" aria-label="Seleziona data di consegna" onChange={handleChange} >
                        {deliveries.map(d => <option key={d.id} value={d.id}>{d.day.toDateString()}</option>)}
                    </Form.Select>
                </Col>
            </Form.Group>
        </Form>
        <Loader isLoading={isLoading} />
        <CustomerDeliveryList customers={customers} />
    </>);
}

const CustomerDeliveryList: React.FC<{ customers: CustomerDelilveryDay[] }> = ({ customers }) =>
    <ListGroup as="ul" className="customers-deliveries-list">

        <ListGroup.Item as="li" key={'header'}>
            <CustomerListItemLargeHeader></CustomerListItemLargeHeader>
        </ListGroup.Item>
        {customers.map((e, index) => (<ListGroup.Item as="li" key={index}>
            <CustomerDeliveryListItem customer={e} />
        </ListGroup.Item>))}
    </ListGroup>

const CustomerListItemLargeHeader = () =>
    <span className="customer-item">
        <span className={"customer-item"}>
            <b>Name</b></span>
        <span className="area" title="Zona in cui abita">
            <b>Zona</b>
        </span>
        <span className="latestDelivery text-center" title="Data ultima consegna">
            <b>Consegnato</b>
        </span>
    </span>

const CustomerDeliveryListItem: React.FC<{ customer: CustomerDelilveryDay }> =
    ({ customer }) => {
        const deliveryDateFormatted = () =>
            customer.deliveryId && customer.day ? customer.day.toDateString() : '';

        return (
            <span className="customer-link">
                <Link to={"/customer/" + customer.id} className={"customer-item"}>
                    <span>
                        {customer.name}</span>
                    <span className="area" title={'Zona: ' + (customer.area ? customer.area : '')}>
                        {customer.area ? customer.area : ''}
                    </span>
                    <span title={'Consegna: ' + deliveryDateFormatted()} className="text-center">
                        {customer.deliveryId && <DeliveredIcon />}
                    </span>
                </Link >
            </span >
        );
    }


const DeliveredIcon = () =>
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="delivered bi bi-bag-check-fill" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5v-.5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zm-.646 5.354a.5.5 0 0 0-.708-.708L7.5 10.793 6.354 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z" />
    </svg>

export default DeliveriesBoardPage;