import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { Customer } from "../model";
import { Loader } from "./Loader";
import './CustomerPage.css';
import { getCustomer } from "../services/customers-query";
import { useAuth } from "../context/AuthContext";
import { CustomerDeliveryModal } from "./delivery/CustomerDeliveryModal";
import { CustomerDeliveriesComponent } from "./CustomerDeliveriesComponent";

function CustomerPage() {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState({} as Customer)
    const { currentUser, roles } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [refreshCustomerData, setRefreshCustomerData] = useState(false);

    const [deliveryShow, setDeliveryShow] = useState(false);

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

    useEffect(() => {
        fetchCustomer();

    }, [customerId]);

    const onSave = () => {
        fetchCustomer();
        setDeliveryShow(false)
    }

    return (
        <>
            <Loader isLoading={isLoading}></Loader>

            {isLoading ? '' :
                <Card className="customer-page">
                    <Card.Body>
                        <h2 className="text-lg-center mb-4">
                            <span>
                                {customer.name}
                            </span>
                            <span className="buttons">
                                {currentUser ? <>
                                    <Button variant="primary" onClick={() => setDeliveryShow(true)}>
                                        <span className="button-name">
                                            Consegna
                                        </span>
                                    </Button>

                                    <CustomerDeliveryModal
                                        show={deliveryShow}
                                        onHide={() => setDeliveryShow(false)}
                                        onSave={onSave}
                                        customerId={customerId ?? ''}
                                    />
                                </>
                                    : ''
                                }
                            </span>
                        </h2>
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
                            <h3 className="text-center">Consegne</h3>

                            {customer.deliveries && customer.deliveries.length > 0 ?
                                <Row><CustomerDeliveriesComponent customerDeliveries={customer.deliveries} /></Row>
                                : <em>Nessuna consegna disponibile</em>
                            }
                            <Row className="actions-row buttons">
                                <Col className="button-action button-action-left">
                                    <Link className=" link btn btn-primary" title="Annulla modifica e torna alla lista" to={"/customers"}>
                                        <span className="button-name">
                                            Annulla
                                        </span>
                                    </Link>
                                </Col>
                                <Col className="button-action button-action-right">
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