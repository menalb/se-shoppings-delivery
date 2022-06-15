import { useEffect, useReducer, useRef, useState } from "react";
import { Container, Row, Col, ListGroup, FormControl, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Customer } from "../model";
import { customersQuery } from "../services/customers-query";
import { useCheckMobileScreen } from "../services/utils";
import { Loader } from "./Loader";
import './CustomersList.css';


type CustomersListSelect = Customer & { selected: boolean };

export const CustomersList = () => {

    const searchTextRef = useRef({} as HTMLInputElement)
    const fake: Customer[] = [{
        id: '1',
        kind: 'customer',
        code: 123,
        name: 'dd',
        address: 'via del pratello'
    },
    {
        id: '2',
        kind: 'customer',
        code: 456,
        name: 'aaa',
        address: 'via del farneto',
        standby: false
    }];
    const [isLoading, setIsLoading] = useState(false);
    const [includeStandby, setIncludeStandby] = useState(false);
    const [customers, setCustomers] = useState([] as CustomersListSelect[]);
    const [filtered, setFiltered] = useState([] as CustomersListSelect[]);
    const [canSelect, setCanSelect] = useState(true);
    const isMobile = useCheckMobileScreen();

    const [selectedCustomers, handleSelection] = useReducer((state: Customer[], customer: Customer): Customer[] =>
        state.some(c => c.id == customer.id)
            ? state.filter(c => c.id !== customer.id)
            : [...state, customer],
        [] as Customer[]);

    const fetchCustomers = async () => {
        setIsLoading(true);

        const customers = await customersQuery();
        setCustomers(customers.map(c => ({ ...c, selected: !(c.standby) })));
        //setCustomers(fake.map(c => ({ ...c, selected: !(c.standby) })));

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
        <><div>
            {selectedCustomers.map(c => <span key={c.id}>{c.id} - {c.name}</span>)}
        </div>
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
                        <CustomerListItemLargeHeader canSelect={canSelect} ></CustomerListItemLargeHeader>
                    </ListGroup.Item>
                    : ''}
                {filtered.map((e, index) => (<ListGroup.Item as="li" key={index} className={e.standby ? 'standby' : ''} >
                    {canSelect ?
                        <span className={!!canSelect ? "customer-item-select" : "customer-item"} >
                            {!!(canSelect) ?
                                <span>
                                    <Form.Group id={"selected_" + e.id} className="text-left">
                                        <Form.Check name="selected" type="switch" onChange={(ev) => handleSelection(e)} checked={e.selected} />
                                    </Form.Group>
                                </span> : ''
                            }
                            <CustomerListItem customer={e} isMobile={isMobile}></CustomerListItem >
                        </span>
                        :
                        <span className="customer-link">
                            <Link to={"/customer/" + e.id} className={!!canSelect ? "customer-item-select" : "customer-item"} >
                                <CustomerListItem customer={e} isMobile={isMobile}></CustomerListItem >
                            </Link>
                        </span>
                    }
                </ListGroup.Item>))}
            </ListGroup>
        </>
    );
}

const CustomerListItem = (props: { isMobile?: boolean, customer: Customer }) => {
    return (
        <>
            {!!(props.isMobile) ?
                <CustomerListItemSmall customer={props.customer} ></CustomerListItemSmall >
                :
                <CustomerListItemLarge customer={props.customer} ></CustomerListItemLarge>
            }
        </>
    )
}

const CustomerListItemSmall = (props: { customer: Customer }) => {
    const customer = props.customer;
    return (
        <>
            <span>
                {customer.name}</span>
            <span className="area" title={'Zona: ' + (customer.area ? customer.area : '')}>
                {customer.area ? customer.area : ''}
            </span>

            {customer.standby ? <em title="Attualmente in standby">[S]</em> : ''}
        </>
    );
}

const CustomerListItemLargeHeader = (props: { canSelect?: boolean }) => {
    return (
        <span className={!!props.canSelect ? "customer-item-select" : "customer-item"}>
            {!!(props.canSelect) ?
                <span><b>Seleziona</b></span> : ''
            }
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
    return (<>
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

        {customer.standby ? <em title="Attualmente in standby">[S]</em> : ''}
    </>
    );
}
