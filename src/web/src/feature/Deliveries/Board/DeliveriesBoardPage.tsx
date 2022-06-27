import { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context";
import { CustomerDelilveryDay, customersQuery, customersQueryByDate } from "../../Customers";
import { Customer } from "../../Customers/model";
import { Loader } from "../../Loader";

const DeliveriesBoardPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { currentUser, roles } = useAuth();
    const [customers, setCustomers] = useState([] as CustomerDelilveryDay[]);

    const fetchCustomers = async () => {
        setIsLoading(true);

        const customers = await customersQueryByDate(new Date(2022, 3, 2));
        
        setCustomers(customers);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchCustomers();
    }, [currentUser]);

    return (<>
        <Loader isLoading={isLoading} />
        <CustomerDeliveryList customers={customers} />
    </>);
}

const CustomerDeliveryList: React.FC<{ customers: CustomerDelilveryDay[] }> = ({ customers}) =>
    <ListGroup as="ul" className="customers-list">

        <ListGroup.Item as="li" key={'header'}>
            <CustomerListItemLargeHeader></CustomerListItemLargeHeader>
        </ListGroup.Item>
        {customers.map((e, index) => (<ListGroup.Item as="li" key={index}>
            <CustomerDeliveryListItem customer={e} />
        </ListGroup.Item>))}
    </ListGroup>

const CustomerListItemLargeHeader = () =>
    <span className="customer-item">
        <span className={"customer-item"}>
            <b>Name</b></span>
        <span className="area" title="Zona in cui abita">
            <b>Zona</b>
        </span>
        <span className="latestDelivery" title="Data ultima consegna">
            <b>Consegna</b>
        </span>
    </span>

const CustomerDeliveryListItem: React.FC<{ customer: CustomerDelilveryDay }> =
    ({ customer }) => {
        const deliveryDateFormatted = () =>
            customer.deliveryId && customer.day ? customer.day.toDateString() : '';

        return (
            <span className="customer-link">
                <Link to={"/customer/" + customer.id} className={"customer-item"}>
                    <span>
                        {customer.name}</span>
                    <span className="area" title={'Zona: ' + (customer.area ? customer.area : '')}>
                        {customer.area ? customer.area : ''}
                    </span>
                    <span title={'Ultima consegna: ' + deliveryDateFormatted()}>
                        {deliveryDateFormatted()}
                    </span>
                </Link >                
            </span >
        );
    }

export default DeliveriesBoardPage;