import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, ListGroup, FormControl, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Customer } from "../model";
import { customersQuery } from "../services/customers-query";
import { useCheckMobileScreen } from "../services/utils";
import { Loader } from "./Loader";

export const CustomersList = () => {

    const searchTextRef = useRef({} as HTMLInputElement)
    const fake: Customer[] = [{
        id: '',
        kind: 'customer',
        code: 123,
        name: 'dd'
    },
    {
        id: '',
        kind: 'customer',
        code: 456,
        name: 'aaa'
    }];
    const [isLoading, setIsLoading] = useState(false);
    const [includeStandby, setIncludeStandby] = useState(false);
    const [customers, setCustomers] = useState([] as Customer[]);
    const [filtered, setFiltered] = useState([] as Customer[]);
    const isMobile = useCheckMobileScreen();

    const fetchCustomers = async () => {
        setIsLoading(true);

        const customers = await customersQuery();
        setCustomers(customers);
        
        setIsLoading(false);
    }

    const handleOnCheangeSearch = () => {
        handleSearch();
    }

    const handleSearch = () => {
        let filtered = customers.filter(c => c.name.toLocaleLowerCase().includes(searchTextRef.current.value.toLocaleLowerCase()));

        if (!includeStandby) {

            filtered = filtered.filter(c => c.standby ? !c.standby : true);
        }

        setFiltered(filtered);
    }

    const handleChangeStandby = () => {
        setIncludeStandby(!includeStandby);
    }

    useEffect(() => {
        fetchCustomers();
        console.log('load');
    }, []);

    useEffect(() => {
        handleSearch();
    }, [includeStandby, customers]);


    return (
        <>
            <Container>
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
            <Container>
                <Form.Group id="standby" as={Row} className="text-left">
                    <Form.Label column xs="4" lg="2" xl="1">Stand By</Form.Label>
                    <Col xs="6" md="4">
                        <Form.Check name="standby" onChange={handleChangeStandby} checked={includeStandby} type="switch" />
                    </Col>
                </Form.Group>

            </Container>
            <Loader isLoading={isLoading}></Loader>
            <ListGroup as="ul">
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
    );
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
            <span className="area" title="Zona">
                <b>Zona</b>
            </span>
            <span title="Indirizzo">
                <b>Indirizzo</b>
            </span>
            <span title="Referente">
                <b>Referente</b>
            </span>

            <span className="area" title="Zona">
                <b>Telefono</b>
            </span>
        </span>
    );
}

const CustomerListItemLarge = (props: { customer: Customer }) => {
    const customer = props.customer;
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
            </Link>
            {customer.standby ? <em title="Attualmente in standby">[S]</em> : ''}
        </span>
    );
}
