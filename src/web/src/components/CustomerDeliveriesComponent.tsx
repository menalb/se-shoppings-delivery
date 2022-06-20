import { ListGroup } from "react-bootstrap"
import { CustomerDelivery } from "../model"

export const CustomerDeliveriesComponent = (props: { customerDeliveries: CustomerDelivery[] }) => {
    return (
        <ListGroup as="ul" >
            {props.customerDeliveries.map(cd =>

                <ListGroup.Item as="li" key={cd.deliveryId}>
                    <p>
                        Consegna del : <b>{cd.deliveryDate.toDateString()}</b>
                    </p>
                    <p>
                        Effettuata da: <b>{cd.deliveredBy}</b>
                    </p>
                    <p>
                        Note: {cd.note}
                    </p>

                </ListGroup.Item>
            )}
        </ListGroup>
    )
}