import React, { useEffect, useReducer, useState } from "react";
import { Col, Container, Form, FormControl, ListGroup, Row } from "react-bootstrap";
import { Customer } from "../model";
import { Loader } from "../../Loader";
import { customersQuery } from "../services/customers-query";
import { useCheckMobileScreen } from "../../../services/utils";
import { AddButton, BirthdayButton, DeliveriesButton, ExportCSV } from "../../Buttons";
import { ButtonActionsComponent } from "../../ActionButtons";
import { useAuth } from "../../../context";
import CustomerList from "./CustomersList";
import { useSearchParams } from "react-router-dom";
import './CustomersPage.css'

type Birthday = { name: string, date?: Date }

const CustomersPage = () => {
    const bithdayRange = 20;

    const [searchParams] = useSearchParams();

    const [searchText, setSearchText] = useState('')
    const [filterRequired, setFilterRequired] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const { currentUser, roles } = useAuth();
    const [customers, setCustomers] = useState([] as Customer[]);
    const [birthdays, setBirthdays] = useState([] as Birthday[]);
    const [showBirthdays, setShowBirthdays] = useState(false);

    const recentBirthdays = (action: Customer[], range: number) => {
        const dt = new Date(Date.now());
        const dtRange: { day: number, month: number }[] = [];
        for (let i = -range; i < range; i++) {
            const r = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + i);
            dtRange.push({ day: r.getDate(), month: r.getMonth() });
        }

        return action.filter(c => c.birthDay &&
            dtRange.some(r => c.birthDay && c.birthDay.getDate() === r.day && c.birthDay.getMonth() === r.month))
            .map(d => ({ name: d.name, date: d.birthDay }));
    }


    const isMobile = useCheckMobileScreen();

    const fetchCustomers = async (sort: string, direction: string) => {
        setIsLoading(true);
        const customers = await customersQuery(sort, direction);
        setCustomers(customers);
        setBirthdays(recentBirthdays(customers, bithdayRange).sort(sortByDateDescending))
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
                <Col xs={3} className="export m-0 text-right">
                    <ExportCSV csvData={mapToExport()} fileName={exportFileName()} />
                </Col>
            </Row>
            <Loader isLoading={isLoading} />

            <Form.Group controlId="filterRequired" as={Row} className="filter-bdays mb-3" >
                <Col xs={2} sm={2} md={1}>
                    <Form.Check name="filterRequired" onChange={filterRequiredChanged} checked={filterRequired} type="switch" />
                </Col>
                <Form.Label column xs={6} sm={4} xl={2}>ISEE non consegnato</Form.Label>
                <Col xs={3} lg={1} xl={1} className="text-right offset-1 offset-sm-3 offset-md-4 offset-lg-6 offset-xl-8">
                    {birthdays.length > 0 &&
                        <BirthdayButton
                            onClick={() => setShowBirthdays(!showBirthdays)}
                            title={showBirthdays ? 'Nascondi lista compleanni' : 'Mostra lista compleanni'}
                        />}
                    {showBirthdays && birthdays.length > 0 &&
                        <BirthdaysList birthdays={birthdays} />}
                </Col>
            </Form.Group>
        </Container>


        <CustomerList customers={filterCustomers()} isMobile={isMobile} canSort={true} />
    </>
    )
}

const BirthdaysList: React.FC<{ birthdays: Birthday[] }> = ({ birthdays }) => <ListGroup as="ul" className="birthdays-list">
    {birthdays.map(b => <ListGroup.Item as="li" key={`${b.name}_bday`}>
        <span className="birthday-item">
            <b>{b.name}</b> <span>{b.date?.toDateString()}</span>
        </span>
    </ListGroup.Item>)}
</ListGroup>

const sortByDateDescending = (a: Birthday, b: Birthday) =>
    a.date && b.date ? b.date.getTime() - a.date.getTime() : 0;

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