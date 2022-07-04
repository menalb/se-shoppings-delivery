import React, { useEffect, useState } from "react";
import { Col, Container, Form, FormControl, Row } from "react-bootstrap";
import { Customer } from "../model";
import { Loader } from "../../Loader";
import { customersQuery } from "../services/customers-query";
import { useCheckMobileScreen } from "../../../services/utils";
import { AddButton, DeliveriesButton, ExportReactCSV } from "../../Buttons";
import { ButtonActionsComponent } from "../../ActionButtons";
import { useAuth } from "../../../context";
import CustomerList from "./CustomersList";
import { useSearchParams } from "react-router-dom";
import './CustomersPage.css'

const CustomersPage = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const [searchText, setSearchText] = useState('')

    const [isLoading, setIsLoading] = useState(false);
    const { currentUser, roles } = useAuth();
    const [customers, setCustomers] = useState([] as Customer[]);
    const isMobile = useCheckMobileScreen();

    const fetchCustomers = async (sort: string, direction: string) => {
        setIsLoading(true);
        const customers = await customersQuery(sort, direction);
        setCustomers(customers);
        setIsLoading(false);
    }

    const isAdmin = (): boolean => {
        return !!currentUser && roles.some(r => r === 'admin');
    }

    const mapToExport = () => customers.map(c => ({
        Nr: c.code ? isNaN(c.code) ? '' : c.code : '',
        Tessera: c.customerId ? isNaN(c.customerId) ? '' : c.customerId : '',
        Quartiere: c.area,
        Nome: c.name,
        Referente: c.reference,
        Famiglia: c.familyStructure,
        RichiesteParticolari: c.note,
        Indirizzo: c.address,
        Telefono: c.phone,
    }));

    useEffect(() => {
        fetchCustomers(searchParams.get('sort') ?? 'name', searchParams.get('direction') ?? 'ASC');
    }, [searchParams]);

    const filterCustomers = () => customers.filter(c => c.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));

    const exportFileName = () => {
        const dt = new Date();
        return `EstrazionePersone_${dt.getFullYear()}_${dt.getMonth() + 1}_${dt.getDate()}`;
    }

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
                <Col xs={2}>
                    <ExportReactCSV csvData={mapToExport()} fileName={exportFileName()} />
                </Col>
            </Row>
            <Loader isLoading={isLoading} />
        </Container>        
        <CustomerList customers={filterCustomers()} isMobile={isMobile} canSort={true} />
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