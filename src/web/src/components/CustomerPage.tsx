import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Customer } from "../model";
import { Loader } from "./Loader";
import './CustomerPage.css';
import { getCustomer } from "../services/customers-query";
import { EditButton, ListButton } from "./Buttons";
import { useAuth } from "../context/AuthContext";

function CustomerPage() {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState({} as Customer)
    const { currentUser, roles } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const fetchCustomer = async () => {
        if (customerId) {
            setIsLoading(true);

            const customer = await getCustomer(customerId);
            if (customer.kind === 'customer') {
                setCustomer(customer);
            }

            setIsLoading(false);
        }
    }

    const handleEdit = () => navigate("/edit/" + customerId);
    const handleCancel = () => navigate('/customers');

    useEffect(() => {
        fetchCustomer();

    }, [customerId]);

    return (
        <>
            {/* <div className="actions buttons">
                <span>
                    <ListCutomersButton></ListCutomersButton>
                </span>
                <span className="edit-action">
                    {customerId && currentUser && roles.some(r => r === 'admin') ?
                        <EditButton customerId={customerId}></EditButton>
                        : ''
                    }
                </span>
            </div> */}

            <Loader isLoading={isLoading}></Loader>

            {isLoading ? '' :
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">{customer.name}</h2>
                        {customer.standby ? <div className="standby">Attenzione: Attualmente in Stand By</div> : ''}
                        <Container>
                            <Row>
                                Tessera
                            </Row>
                            <Row>
                                {customer.code ? <b>{customer.code}</b> : <em>tessera non assegnata</em>}
                            </Row>
                            <Row>
                                Zona
                            </Row>
                            <Row>
                                <b>{customer.area}</b>
                            </Row>
                            <Row>
                                Referente
                            </Row>
                            <Row>
                                <b>{customer.reference}</b>
                            </Row>
                            <Row>
                                Viene lui
                            </Row>
                            <Row>
                                <b>{!!customer.homeDelivery ? 'SI' : 'NO'}</b>
                            </Row>
                            <Row>
                                Indirizzo
                            </Row>
                            <Row>
                                <b>
                                    {customer.linkMaps ?
                                        <a title="indirizzo, fare click per aprire la mappa" href={customer.linkMaps}>{customer.address}</a>
                                        :
                                        customer.address
                                    }
                                </b>
                            </Row>
                            <Row>
                                Telefono
                            </Row>
                            <Row>
                                {customer.phone ? <b><a title="numero di telefono, avviare la telefonata" href={'tel:' + customer.phone}>{customer.phone}</a></b> : <em>numero di telefono non disponibile</em>}
                            </Row>
                            <Row>
                                Componenti Famiglia
                            </Row>
                            <Row>
                                <b>{customer.familyStructure ? customer.familyStructure : ' '}</b>
                            </Row>
                            <Row>
                                Adulti
                            </Row>
                            <Row>
                                <b>{customer.adults ? customer.adults : ' '}</b>
                            </Row>
                            <Row>
                                Bambini
                            </Row>
                            <Row>
                                <b>{customer.children ? customer.children : ' '}</b>
                            </Row>
                            <Row>
                                Richieste Particolari
                            </Row>
                            <Row>
                                <b>{customer.note ? customer.note : ' '}</b>
                            </Row>

                            <Row className="bottom-actions buttons">
                                <Col className="bottom-action bottom-action-left">
                                    <Link className=" link btn btn-primary" title="Annulla modifica e torna alla lista" to={"/customers"}>
                                        <span className="button-name">
                                            Annulla
                                        </span>
                                    </Link>
                                </Col>
                                <Col className="bottom-action bottom-action-right">
                                    <Link className=" link btn btn-primary" title="Modifica dati" to={"/edit/" + customerId}>
                                        <span className="button-name">
                                            Modifica
                                        </span>
                                    </Link>
                                </Col>
                            </Row>
                        </Container>
                    </Card.Body>
                </Card>
            }
        </>
    )
}


export default CustomerPage;