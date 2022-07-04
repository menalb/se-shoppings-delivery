import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { Customer } from "../model";

import './CustomersList.css'

const CustomerList: React.FC<{ customers: Customer[], isMobile: boolean, canSort: boolean }> = ({ customers, isMobile, canSort }) =>
    <ListGroup as="ul" className="customers-list">
        {!isMobile &&
            <ListGroup.Item as="li" key={'header'}>
                <CustomerListItemLargeHeader canSort={true}></CustomerListItemLargeHeader>
            </ListGroup.Item>
        }
        {customers.map((e, index) => (<ListGroup.Item as="li" key={index} className={e.standby ? 'standby' : ''} >
            {isMobile ?
                <CustomerListItemSmall customer={e} ></CustomerListItemSmall>
                :
                <CustomerListItemLarge customer={e} ></CustomerListItemLarge>
            }

        </ListGroup.Item>))}
    </ListGroup>


const CustomerListItemLargeHeader: React.FC<{ canSort: boolean }> = (canSort) => {
    const [sort, setSort] = useState('name');
    const [direction, setDirection] = useState('ASC');

    const [searchParams, setSearchParams] = useSearchParams();
    const buildTo = (name: string) => `?sort=${name}&direction=${direction}`;
    useEffect(() => {
        if (searchParams && searchParams.get('sort') && searchParams.get('direction')) {
            setSort(searchParams.get('sort') ?? 'name');
            setDirection(searchParams.has('direction') && searchParams.get('direction') === 'ASC' ? 'DESC' : 'ASC');
        }
    }, [searchParams]);

    return (
        <span className="customer-item">
            <span>
                <Link to={buildTo('name')}>
                    <b>Nome</b>
                </Link>
            </span>
            <span className="area" title="Zona in cui abita">
                <Link to={buildTo('area')}>
                    <b>Zona</b>
                </Link>
            </span>
            <span title="Indirizzo consegna spesa">
                <b>Indirizzo</b>
            </span>
            <span title="Persona Referente">
                <Link to={buildTo('reference')}>
                    <b>
                        Referente</b>
                </Link>
            </span>

            <span className="area" title="Teleforno fi riferimento">
                <b>Telefono</b>
            </span>

            <span className="latestDelivery" title="Data ultima consegna">
                <b>Consegna</b>
            </span>
        </span>
    )
}

const CustomerListItemSmall: React.FC<{ customer: Customer }> =
    ({ customer }) =>
        <span className="customer-link">
            <Link to={"/customer/" + customer.id} className={"customer-item-xs"}>
                <span>
                    {customer.name}</span>
                <span className="area" title={'Zona: ' + (customer.area ? customer.area : '')}>
                    {customer.area ? customer.area : ''}
                </span>
            </Link>
            {customer.standby ? <em title="Attualmente in standby">[S]</em> : ''}
        </span>

const CustomerListItemLarge: React.FC<{ customer: Customer }> =
    ({ customer }) => {
        const deliveryDateFormatted = () =>
            customer.deliveries && customer.deliveries.length > 0 ? customer.deliveries[0].deliveryDate.toDateString() : '';

        return (
            <span className="customer-link">
                <Link to={"/customer/" + customer.id} className={"customer-item"}>
                    <span>
                        {customer.name}</span>
                    <span className="area" title={'Zona: ' + (customer.area ? customer.area : '')}>
                        {customer.area ? customer.area : ''}
                    </span>
                    <span title="Indirizzo">
                        {customer.address ? customer.address : ''}
                    </span>
                    <span title="Referente">
                        {customer.reference ? customer.reference : ''}
                    </span>
                    <span title={'Telefono: ' + (customer.phone ? customer.phone : '')}>
                        {customer.phone ? customer.phone : ''}
                    </span>
                    <span title={'Ultima consegna: ' + deliveryDateFormatted()}>
                        {deliveryDateFormatted()}
                    </span>
                </Link >
                {customer.standby && <em title="Attualmente in standby">[S]</em>}
            </span >
        );
    }

export default CustomerList;