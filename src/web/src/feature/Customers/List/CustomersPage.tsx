import React, { useEffect, useState } from "react";
import { Col, Container, Form, FormControl, Row } from "react-bootstrap";
import { Customer } from "../model";
import { Loader } from "../../Loader";
import { customersQuery } from "../services/customers-query";
import { useCheckMobileScreen } from "../../../services/utils";
import { AddButton, DeliveriesButton } from "../../Buttons";
import { ButtonActionsComponent } from "../../ActionButtons";
import { useAuth } from "../../../context";
import CustomerList from "./CustomersList";

import './CustomersPage.css'

const CustomersPage = () => {

    const [searchText, setSearchText] = useState('')

    const [isLoading, setIsLoading] = useState(false);
    const { currentUser, roles } = useAuth();
    const [customers, setCustomers] = useState([] as Customer[]);
    const isMobile = useCheckMobileScreen();

    const fetchCustomers = async () => {
        setIsLoading(true);

        const customers = await customersQuery();
        setCustomers(customers);
        setIsLoading(false);
    }

    const isAdmin = (): boolean => {
        return !!currentUser && roles.some(r => r === 'admin');
    }

    useEffect(() => {
        fetchCustomers();
    }, [currentUser]);

    const filterCustomers = () => customers.filter(c => c.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));

    return (<>
        <Container className="head-container customers-page-actions">
            {isAdmin() &&
                <ButtonActionsComponent
                    left={<DeliveriesButton />}
                    right={<AddButton />}
                />}
            <Row className="search">
                <Col xs={9} md={4}>
                    <SearchBar searchText={searchText} onSearchTextChange={setSearchText} />
                </Col>
            </Row>
        </Container>
        <Loader isLoading={isLoading} />
        <CustomerList customers={filterCustomers()} isMobile={isMobile} />
    </>
    )
}

const SearchBar: React.FC<{ searchText: string, onSearchTextChange: (text: string) => void }> =
    ({ searchText, onSearchTextChange }) => <Form>
        <FormControl className="mb-6"
            placeholder="Nome"
            aria-label="Nome"
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
        />
    </Form>

export default CustomersPage;