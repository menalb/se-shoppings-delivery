import { useEffect, useState } from "react";
import { Col, ListGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Delivery } from "../../model";
import { deliveriesQuery } from "../../services/delivery-query";
import { Loader } from "../Loader";
import { AddDeliveryButton } from "./../Buttons";

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
        <h2 className="text-center">Giri</h2>
        <Loader isLoading={isLoading}></Loader>
        <ListGroup as="ul" >
            {deliveries.map(d =>
                <ListGroup.Item as="li" key={d.id}>
                    <>
                        <div>
                            Giorno: <b><Link to={"/edit-delivery/" + d.id}>{d.day.toDateString()}</Link></b>
                        </div>
                        <div>
                            Note: {d.note}
                        </div>
                    </>
                </ListGroup.Item>
            )}
        </ListGroup>
        <Row className="actions-row buttons">
            <Col className="button-action button-action-left">
                <Link className=" link btn btn-secondary" title="Annulla modifica e torna all'elenco" to={"/customers"}>
                    <span className="button-name">
                        Torna a elenco
                    </span>
                </Link>
            </Col>
            <Col className="button-action button-action-right">
                {isAdmin() ?
                    <AddDeliveryButton></AddDeliveryButton>
                    : ''}
            </Col>
        </Row>
    </>)
}