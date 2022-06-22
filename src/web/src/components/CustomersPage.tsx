import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Container, FormControl, ListGroup, Row } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { Customer } from "../model";
import './CustomersPage.css'
import { Loader } from "./Loader";
import { customersQuery } from "../services/customers-query";
import { useCheckMobileScreen } from "../services/utils";
import { AddButton, DeliveriesButton } from "./Buttons";
import { ButtonActionsComponent } from "./ActionButtons";

function CustomersPage() {

    const searchTextRef = useRef({} as HTMLInputElement)

    const [isLoading, setIsLoading] = useState(false);
    const { currentUser, roles } = useAuth();
    const [customers, setCustomers] = useState([] as Customer[]);
    const [filtered, setFiltered] = useState([] as Customer[]);
    const isMobile = useCheckMobileScreen();

    const fetchCustomers = async () => {
        setIsLoading(true);

        const customers = await customersQuery();
        setCustomers(customers);
        setFiltered(customers);
        setIsLoading(false);
    }

    const isAdmin = (): boolean => {
        return !!currentUser && roles.some(r => r === 'admin');
    }

    useEffect(() => {
        fetchCustomers();
    }, [currentUser]);

    const handleOnCheangeSearch = () => {
        handleSearch();
    }

    const handleSearch = () => {
        const filtered = customers.filter(c => c.name.toLocaleLowerCase().includes(searchTextRef.current.value.toLocaleLowerCase()));
        setFiltered(filtered);
    }

    return (<>
        <Container className="head-container customers-page-actions">
            {isAdmin() ?
                <ButtonActionsComponent
                    left={<DeliveriesButton />}
                    right={<AddButton />}
                />
                : ''}
            <Row className="search">
                <Col xs={9} md={4}><FormControl className="mb-6"
                    placeholder="Nome"
                    aria-label="Nome"
                    ref={searchTextRef}
                    onChange={handleOnCheangeSearch}
                /></Col>
                <Col xs={2}>
                    <Button className="mb-4" onClick={handleSearch}>Cerca</Button>
                </Col>
            </Row>
        </Container>
        <Loader isLoading={isLoading}></Loader>
        <ListGroup as="ul" className="customers-list">
            {!isMobile ?
                <ListGroup.Item as="li" key={'header'}>
                    <CustomerListItemLargeHeader></CustomerListItemLargeHeader>
                </ListGroup.Item>
                : ''}
            {filtered.map((e, index) => (<ListGroup.Item as="li" key={index} className={e.standby ? 'standby' : ''} >
                {isMobile ?
                    <CustomerListItem customer={e} ></CustomerListItem>
                    :
                    <CustomerListItemLarge customer={e} ></CustomerListItemLarge>
                }

            </ListGroup.Item>))}
        </ListGroup>
    </>
    )
}

const CustomerListItem = (props: { customer: Customer }) => {
    const customer = props.customer;
    return (
        <span className="customer-link">
            <Link to={"/customer/" + customer.id} className={"customer-item-xs"}>
                <span>
                    {customer.name}</span>
                <span className="area" title={'Zona: ' + (customer.area ? customer.area : '')}>
                    {customer.area ? customer.area : ''}
                </span>
            </Link>
            {customer.standby ? <em title="Attualmente in standby">[S]</em> : ''}
        </span>
    );
}

const CustomerListItemLargeHeader = () => {
    return (
        <span className="customer-item">
            <span className={"customer-item"}>
                <b>Name</b></span>
            <span className="area" title="Zona in cui abita">
                <b>Zona</b>
            </span>
            <span title="Indirizzo consegna spesa">
                <b>Indirizzo</b>
            </span>
            <span title="Persona Referente">
                <b>Referente</b>
            </span>

            <span className="area" title="Teleforno fi riferimento">
                <b>Telefono</b>
            </span>

            <span className="latestDelivery" title="Data ultima consegna">
                <b>Consegna</b>
            </span>
        </span>
    );
}

const CustomerListItemLarge = (props: { customer: Customer }) => {
    const customer = props.customer;
    const deliveryDateFormatted = () =>
        customer.deliveries && customer.deliveries.length > 0 ? customer.deliveries[0].deliveryDate.toDateString() : '';

    return (
        <span className="customer-link">
            <Link to={"/customer/" + customer.id} className={"customer-item"}>
                <span>
                    {customer.name}</span>
                <span className="area" title={'Zona: ' + (customer.area ? customer.area : '')}>
                    {customer.area ? customer.area : ''}
                </span>
                <span title="Indirizzo">
                    {customer.address ? customer.address : ''}
                </span>
                <span title="Referente">
                    {customer.reference ? customer.reference : ''}
                </span>
                <span title={'Telefono: ' + (customer.phone ? customer.phone : '')}>
                    {customer.phone ? customer.phone : ''}
                </span>
                <span title={'Ultima consegna: ' + deliveryDateFormatted()}>
                    {deliveryDateFormatted()}
                </span>
            </Link >
            {customer.standby ? <em title="Attualmente in standby">[S]</em> : ''}
        </span >
    );
}


export default CustomersPage;