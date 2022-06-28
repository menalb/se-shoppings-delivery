import { Col, ListGroup, Row } from "react-bootstrap"
import { CustomerDelivery } from "../model"
import './CustomerDeliveriesComponent.css'

export const CustomerDeliveriesComponent = (props: { customerDeliveries: CustomerDelivery[], onDeliveryClick: (cd: CustomerDelivery) => void; }) => {
    return (
        <ListGroup as="ul" variant="flush" className="customer-deliveries-list" >
            {props.customerDeliveries.map(cd =>

                <ListGroup.Item as="li" key={cd.deliveryId} className="list-group-item-action" onClick={e => props.onDeliveryClick(cd)}>
                    <Row>
                        <Col xs={5} lg={2}>
                            <b title="Consegna del">{cd.deliveryDate.toDateString()}</b>
                        </Col>
                        {cd.deliveredBy !== '' && <><Col xs={4} lg={2}>
                            Effettuata da:
                        </Col>
                            <Col>
                                <b>{cd.deliveredBy}</b>
                            </Col></>}
                    </Row>                    
                    {!(cd.deliveryDate >= cd.deliveryDay && cd.deliveryDate <= cd.deliveryDay) &&
                        <Row><Col><em>Consegnato il: {cd.deliveryDate.toDateString() }</em></Col></Row>
                    }
                    {cd.note !== '' &&
                        <Row>
                            <Col xs={4} lg={2}>Note:</Col>
                            <Col>{cd.note}</Col>
                        </Row>}
                </ListGroup.Item>
            )}
        </ListGroup>
    )
}