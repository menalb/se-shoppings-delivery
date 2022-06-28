import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { Customer, CustomerDelivery } from "../model";
import { Loader } from "../../Loader";
import { getCustomer } from "../services/customers-query";
import { useAuth } from "../../../context/AuthContext";
import { CustomerDeliveryModal } from "../Deliveries/CustomerDeliveryModal";
import { CustomerDeliveriesComponent } from "../Deliveries/CustomerDeliveriesComponent";

import './CustomerPage.css';
import { ButtonActionsComponent, DeliveryButton, PrimaryLinkComponent, SaveCancelButtonsComponent, SecondaryLinkComponent } from "../../ActionButtons";

function CustomerPage() {
    const { customerId } = useParams();

    const emptyCustomerDelivery: CustomerDelivery = {
        deliveryId: '',
        customerId: customerId ?? '',
        note: '',
        deliveredBy: '',
        deliveryDate: new Date(Date.now()),
        deliveryDay: new Date(Date.now())
    };

    const [customer, setCustomer] = useState({} as Customer)
    const { currentUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [deliveryToEdit, setDeliveryToEdit] = useState(emptyCustomerDelivery);

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
        setDeliveryToEdit(emptyCustomerDelivery);
        setDeliveryShow(false)
    }

    const newDeliveryClick = () => {
        setDeliveryToEdit(emptyCustomerDelivery);
        setDeliveryShow(true);
    }

    const deliveryClick = (cd: CustomerDelivery) => {
        setDeliveryToEdit(cd);
        setDeliveryShow(true);
    }

    return (
        <>
            <Loader isLoading={isLoading}></Loader>

            {!isLoading &&
                <Card className="customer-page">
                    <Card.Body>
                        <h2 className="text-lg-center mb-4">
                            <span>
                                {customer.name}
                            </span>
                            <span className="buttons">
                                {currentUser && <>                                   
                                    <DeliveryButton onClick={() => newDeliveryClick()} />

                                    <CustomerDeliveryModal
                                        show={deliveryShow}
                                        onHide={() => setDeliveryShow(false)}
                                        onSave={onSave}
                                        customerId={customerId ?? ''}
                                        delivery={deliveryToEdit}
                                        canDelete={deliveryToEdit.deliveryId !== ''}
                                    />
                                </>}
                            </span>
                        </h2>
                        {customer.standby && <div className="standby">Attenzione: Attualmente in Stand By</div>}
                        <Container className="content">
                            <Row>
                                Tessera{deliveryToEdit.deliveryId}
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
                            <h3 className="text-center">Consegne ({customer.deliveries ? customer.deliveries.length : 0})</h3>
                            <Row>
                                <em className="text-center">Selezionare la riga per modificare</em>
                            </Row>
                            {customer.deliveries && customer.deliveries.length > 0 ?
                                <Row><CustomerDeliveriesComponent customerDeliveries={customer.deliveries} onDeliveryClick={cd => deliveryClick(cd)} /></Row>
                                : <Row><em className="no-delivery text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                                        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                                    </svg>
                                    Nessuna consegna disponibile
                                </em></Row>
                            }
                        </Container>
                        <Container>

                            <ButtonActionsComponent
                                left={<SecondaryLinkComponent link={"/customers"} text={'Elenco Persone'} title={`Torna all'elenco delle persone`} />}
                                right={<PrimaryLinkComponent link={`/edit/${customerId}`} text={'Modifica'} title={`Modifica Persona`} />}
                            />
                        </Container>
                    </Card.Body>
                </Card>
            }
        </>
    )
}


export default CustomerPage;