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

    const [searchParams] = useSearchParams();

    const [searchText, setSearchText] = useState('')
    const [filterRequired, setFilterRequired] = useState(false);

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
        Nome: c.name,
        Quartiere: c.area,
        Referente: c.reference,
        Famiglia: c.familyStructure,
        RichiesteParticolari: c.note,
        Indirizzo: c.address,
        Telefono: c.phone,
        DataConsegnaISEE: c.documentationDeliveredOn ? c.documentationDeliveredOn.toDateString() : ''
    }));

    useEffect(() => {
        fetchCustomers(searchParams.get('sort') ?? 'name', searchParams.get('direction') ?? 'ASC');
    }, [searchParams]);

    const filterCustomers = () =>
        customers.filter(c =>
            c.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) && (filterRequired ? !(c.documentationDeliveredOn) : c.documentationDeliveredOn === c.documentationDeliveredOn)
        );

    const exportFileName = () => {
        const dt = new Date();
        return `EstrazionePersone_${dt.getFullYear()}_${dt.getMonth() + 1}_${dt.getDate()}`;
    }

    const filterRequiredChanged = () => {
        setFilterRequired(!filterRequired);
    }

    return (<>
        <Container className="head-container customers-page-actions">
            {isAdmin() &&
                <ButtonActionsComponent
                    left={<DeliveriesButton />}
                    right={<AddButton />}
                />}
            <Row className="search">
                <Col xs={9} md={4} className="p-0">
                    <SearchBar searchText={searchText} onSearchTextChange={setSearchText} />
                </Col>
                <Col xs={1} className="export">
                    <ExportReactCSV csvData={mapToExport()} fileName={exportFileName()} />
                </Col>
            </Row>
            <Loader isLoading={isLoading} />
            {!isMobile &&
                <Form.Group controlId="filterRequired" as={Row} className="mb-3" >
                    <Col sm={1} lg={1} xl={1}>
                        <Form.Check name="filterRequired"  onChange={filterRequiredChanged} checked={filterRequired} type="switch" />
                    </Col>                    
                    <Form.Label column sm={4} xl={2}>ISEE non consegnato</Form.Label>
                </Form.Group>}
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