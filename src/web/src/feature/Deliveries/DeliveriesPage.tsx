import { useEffect, useState } from "react";
import { Col, Container, ListGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Delivery } from "./model";
import { deliveriesQuery } from "./services/delivery-query";
import { ButtonActionsComponent, SecondaryLinkComponent } from "../ActionButtons";
import { Loader } from "../Loader";
import { AddDeliveryButton } from "../Buttons";
import { useAuth } from "../../context";
import './DeliveriesPage.css'

export const DeliveriesPage = () => {

    const { currentUser, roles } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [deliveries, setDeliveries] = useState([] as Delivery[]);

    const isAdmin = (): boolean => {
        return !!currentUser && roles.some(r => r === 'admin');
    }

    const fetchDeliveries = async () => {
        setIsLoading(true);

        const deliveries = await deliveriesQuery();
        setDeliveries(deliveries);
        // setFiltered(customers);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchDeliveries();
    }, [currentUser]);

    return (<>
        <Container className="deliveries-container">
            <h2 className="text-center">Giri</h2>
            <Loader isLoading={isLoading}></Loader>
            <ListGroup as="ul" className="deliveries-list">
                {deliveries.map(d =>
                    <ListGroup.Item as="li" key={d.id}>

                        <Row><Col xs={2}>
                            Giorno:
                        </Col>
                            <Col xs={6}>
                                <b><Link to={"/deliveries/edit/" + d.id}>{d.day.toDateString()}</Link></b>
                            </Col>
                            <Col xs={4}>
                                <Link to={"/deliveries/board/" + d.id}>Dettaglio</Link>
                            </Col>
                        </Row>
                        <Row><Col xs={2}>
                            Note:
                        </Col>
                            <Col xs={8}>{d.note}

                            </Col>
                        </Row>

                    </ListGroup.Item>
                )}
            </ListGroup>
            <ButtonActionsComponent
                left={<SecondaryLinkComponent link="/customers" text="Elenco Persone" title="Torna all'elenco delle persone" />}
                right={isAdmin() ?
                    <AddDeliveryButton></AddDeliveryButton>
                    : <></>}
            />
        </Container>
    </>)
}