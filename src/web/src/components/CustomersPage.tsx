import { useEffect, useRef, useState } from "react";
import { db } from "../firebase-config";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Button, Col, Container, FormControl, ListGroup, Row } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { Customer } from "../model";
import './CustomersPage.css'
import { Loader } from "./Loader";
import { customersQuery } from "../services/customers-query";
import { useCheckMobileScreen } from "../services/utils";

function CustomersPage() {
    const navigate = useNavigate();

    const searchTextRef = useRef({} as HTMLInputElement)

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { currentUser, logout } = useAuth();
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

    useEffect(() => {
        fetchCustomers();
    }, [currentUser]);

    // async function handleLogout() {
    //     setError("")

    //     if (logout) {
    //         try {
    //             await logout()
    //             navigate("/login")
    //         } catch {
    //             setError("Failed to log out")
    //         }
    //     }
    // }
    const handleOnCheangeSearch = () => {
        handleSearch();
    }

    const handleSearch = () => {
        const filtered = customers.filter(c => c.name.toLocaleLowerCase().includes(searchTextRef.current.value.toLocaleLowerCase()));
        setFiltered(filtered);
    }

    return (<>
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
        <Loader isLoading={isLoading}></Loader>
        <ListGroup>
            {!isMobile ?
                <ListGroup.Item key={'header'}>
                    <CustomerListItemLargeHeader></CustomerListItemLargeHeader>
                </ListGroup.Item>
                : ''}
            {filtered.map((e, index) => (<ListGroup.Item key={index} className={e.standby ? 'standby' : ''} >
                {isMobile ?
                    <CustomerListItem customer={e} ></CustomerListItem>
                    :
                    <CustomerListItemLarge customer={e} ></CustomerListItemLarge>
                }

            </ListGroup.Item>))}
        </ListGroup>
        {/* <div className="w-100 text-center mt-2">
            <Button variant="link" onClick={handleLogout}>
                Log Out
            </Button>
        </div> */}
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


export default CustomersPage;