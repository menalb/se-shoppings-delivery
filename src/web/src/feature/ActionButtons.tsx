import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export const SaveCancelButtonsComponent = (props:
    {
        cancel: LinkComponentProps,
        submit: ActionComponentProps
    }) =>
    <ButtonActionsComponent
        left={<SecondaryLinkComponent {...props.cancel} />}
        right={<Button type="submit" title={props.submit.title}>{props.submit.text}</Button>}
    />

type LinkComponentProps = ActionComponentProps & { link: string }
type ActionComponentProps = { text?: string, title?: string }


export const SecondaryLinkComponent = (props: LinkComponentProps) =>
    <Link className=" link btn btn-secondary" title={props.title} to={props.link}>
        <span className="button-name">
            {props.text}
        </span>
    </Link>
export const PrimaryLinkComponent = (props: LinkComponentProps) =>
    <Link className=" link btn btn-primary" title={props.title} to={props.link}>
        <span className="button-name">
            {props.text}
        </span>
    </Link>

export const ButtonActionsComponent = (props:
    {
        left: JSX.Element,
        right: JSX.Element
    }) =>
    <Row className="actions-row buttons">
        <Col className="button-action button-action-left">
            {props.left}
        </Col>
        <Col className="button-action button-action-right">
            {props.right}
        </Col>
    </Row>


export const DeliveryButton = (props: {onClick: ()=>void}) => <Button variant="primary" onClick={props.onClick}>
    <span className="button-name">
        Consegna
    </span>
</Button>

export const RemoveDeliveryButton = (props: { onClick: () => void }) => <Button variant="danger" onClick={props.onClick}>
    <span className="button-name">
        Rimuovi
    </span>
</Button>