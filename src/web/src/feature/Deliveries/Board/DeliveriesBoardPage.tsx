import { useEffect, useState } from "react";
import { Alert, Col, Form, FormControl, ListGroup, Row } from "react-bootstrap";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context";
import { parseYearFromQueryString, useCheckMobileScreen } from "../../../services/utils";
import { DeliveryButton, RemoveDeliveryButton, SecondaryLinkComponent } from "../../ActionButtons";
import { CustomerDelilveryDay, customersQueryByDelivery } from "../../Customers";

import { logDelivery, removeDelivery } from "../../Customers/services/customer-command";
import { Loader } from "../../Loader";
import { Delivery } from "../model";
import { deliveriesQuery } from "../services/delivery-query";
import './DeliveriesBoardPage.css'

const DeliveriesBoardPage = () => {

    const isMobile = useCheckMobileScreen();
    const [searchParams] = useSearchParams();

    const { deliveryId } = useParams();
    const [searchText, setSearchText] = useState('')
    const [error, setError] = useState("")

    const [isLoading, setIsLoading] = useState(false);
    const { currentUser, roles } = useAuth();
    const [deliveries, setDeliveries] = useState([] as Delivery[]);
    const [selectedDelivery, setSelectedDelivery] = useState({} as Delivery);

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

    const deliveriesListUrl = () => {
        const base = '/deliveries';
        const parsedYear = parseYearFromQueryString(searchParams);
        if (parsedYear !== 'parse-error') {
            return `${base}?year=${parsedYear}`;
        }
        return base;
    }

    useEffect(() => {
        fetchDeliveries();
    }, [currentUser]);

    useEffect(() => {
        if (isLoading) {
            setError('');
        }
    }, [isLoading]);

    useEffect(() => {
        if (deliveries.length > 0) {
            let delivery = deliveryId ? deliveries.find(d => d.id === deliveryId) : deliveries[0];
            if (!delivery) {
                delivery = deliveries[0];
            }
            setSelectedDelivery(delivery);
            fetchCustomersAndDeliveries(delivery.id);
        }
    }, [deliveries]);

    const handleChange = (event: React.ChangeEvent<any>) => {
        const delivery = deliveries.find(d => d.id === event.target.value);
        if (delivery) {
            setSelectedDelivery(delivery);
            fetchCustomersAndDeliveries(delivery.id);
        }
    }

    const deliver = async (customerId: string) => {
        setIsLoading(true);
        if (currentUser) {

            try {
                const newDelivery = await logDelivery(
                    {
                        deliveredBy: '',
                        deliveryId: selectedDelivery.id,
                        deliveryDay: selectedDelivery.day,
                        deliveryDate: selectedDelivery.day,
                        note: '',
                        customerId: customerId
                    }, currentUser.uid);

                setCustomers(customers.map(c => c.id === customerId ?
                    ({ ...c, deliveryId: newDelivery.deliveryId, day: newDelivery.deliveryDate }) : c
                ));
            }
            catch (e) {
                console.error(e);
                setError('Operazione fallita');
            }
        }
        else {
            setIsLoading(false);
            setError('Utente non valido');
            throw new Error('Invalid user');
        }
        setIsLoading(false);
    }

    const undeliver = async (customerId: string) => {
        setIsLoading(true);
        if (currentUser) {
            try {

                await removeDelivery(
                    {
                        deliveredBy: '',
                        deliveryId: selectedDelivery.id,
                        deliveryDate: selectedDelivery.day,
                        deliveryDay: selectedDelivery.day,
                        note: '',
                        customerId: customerId
                    }, currentUser.uid);

                setCustomers(customers.map(c => c.id === customerId ?
                    ({ ...c, deliveryId: undefined, day: undefined }) : c
                ));
            }
            catch (e) {
                console.error(e);
                setError('Operazione fallita');
            }
        }
        setIsLoading(false);
    }

    const filterCustomers = () => customers.filter(c => c.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));

    return (<>
        <Form>
            <Form.Group as={Row} className="mb-3" controlId="day">
                <Col xs={12} sm={4}>
                    <SecondaryLinkComponent link={deliveriesListUrl()} text="Elenco consegne" title="Torna all'elenco delle consegne" />
                </Col>
                <Col>
                    <Row>
                        <Form.Label column xs={2} lg={1} >Data</Form.Label>

                        <Col sm={6} lg={4}>
                            <Form.Select name="deliveryId" aria-label="Seleziona data di consegna" onChange={handleChange} value={selectedDelivery.id} >
                                {deliveries.map(d => <option key={d.id} value={d.id}>{d.day.toDateString()}</option>)}
                            </Form.Select>
                        </Col>
                    </Row>
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="day">

                <Col xs={9} md={4}>
                    <SearchBar searchText={searchText} onSearchTextChange={setSearchText} />
                </Col>
                <Col>
                    <Loader isLoading={isLoading} />
                </Col>
            </Form.Group>
        </Form>
        {error && <Alert variant="danger">{error}</Alert>}

        <CustomerDeliveryList customers={filterCustomers()} deliver={deliver} removeDelivery={undeliver} isMobile={isMobile} />
    </>);
}

const SearchBar: React.FC<{ searchText: string, onSearchTextChange: (text: string) => void }> =
    ({ searchText, onSearchTextChange }) =>
        <FormControl className="mb-6"
            placeholder="cerca per nome"
            aria-label="Nome"
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
        />

const CustomerDeliveryList: React.FC<{
    customers: CustomerDelilveryDay[],
    deliver: (customerId: string) => void,
    removeDelivery: (customerId: string) => void,
    isMobile: boolean
}> = ({ customers, deliver, removeDelivery, isMobile }) =>
        <ListGroup as="ul" className="customers-deliveries-list">

            <ListGroup.Item as="li" key={'header'}>
                <CustomerListItemLargeHeader isMobile={isMobile}></CustomerListItemLargeHeader>
            </ListGroup.Item>
            {customers.map((e, index) => (<ListGroup.Item as="li" key={index}>
                <CustomerDeliveryListItem customer={e} deliver={deliver} removeDelivery={removeDelivery} isMobile={isMobile} />
            </ListGroup.Item>))}
        </ListGroup>

const CustomerListItemLargeHeader = (props: { isMobile: boolean }) =>
    <span className={props.isMobile ? 'customer-delivery-item-xs' : 'customer-delivery-item'} >
        <span>
            <b>Nome</b></span>
        <span className="area" title="Zona in cui abita">
            <b>Zona</b>
        </span>
        {!props.isMobile &&
            <span className="text-center" title="Data ultima consegna">
                <b>Consegnato</b>
            </span>
        }
        <span>

        </span>
    </span>

const CustomerDeliveryListItem: React.FC<{
    customer: CustomerDelilveryDay,
    deliver: (customerId: string) => void,
    removeDelivery: (customerId: string) => void,
    isMobile: boolean
}> =
    ({ customer, deliver, removeDelivery, isMobile }) => {
        const deliveryDateFormatted = () =>
            customer.deliveryId && customer.day ? customer.day.toDateString() : '';

        return (
            <span className={"customer-link " + (isMobile ? 'customer-delivery-item-xs' : 'customer-delivery-item')}>
                <Link to={"/customer/" + customer.id}>
                    <span>
                        {customer.name}</span>
                </Link >
                <span className="area" title={'Zona: ' + (customer.area ? customer.area : '')}>
                    {customer.area ? customer.area : ''}
                </span>
                {!isMobile &&
                    <span title={'Consegna: ' + deliveryDateFormatted()} className="text-center">
                        {customer.deliveryId && <DeliveredIcon />}
                    </span>}
                <span title={'Consegna: '} >
                    {customer.deliveryId ?
                        <RemoveDeliveryButton onClick={() =>

                            removeDelivery(customer.id)}

                        />
                        :
                        <DeliveryButton onClick={() =>
                            deliver(customer.id)

                        } />
                    }
                </span>

            </span >
        );
    }


const DeliveredIcon = () =>
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="delivered bi bi-bag-check-fill" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5v-.5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zm-.646 5.354a.5.5 0 0 0-.708-.708L7.5 10.793 6.354 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z" />
    </svg>

export default DeliveriesBoardPage;