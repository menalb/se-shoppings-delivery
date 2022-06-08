import { Col, Row } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { AddDeliveryButton } from "./Buttons";

export const DeliveriesPage = () => {

    const { currentUser, roles } = useAuth();

    const isAdmin = (): boolean => {
        return !!currentUser && roles.some(r => r === 'admin');
    }


    return (<>
        <h2>Giri</h2>
        {isAdmin() ?
            <Row className="buttons">
                <Col xs={6}>
                    <AddDeliveryButton></AddDeliveryButton>
                </Col>
            </Row>
            : ''}
    </>)
}