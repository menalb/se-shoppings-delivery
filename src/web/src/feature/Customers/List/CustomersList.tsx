import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { Customer } from "../model";

import './CustomersList.css'
import { SortIndicator } from "../../SortIndicator";

const CustomerList: React.FC<{ customers: Customer[], isMobile: boolean, canSort: boolean }> = ({ customers, isMobile, canSort }) =>
    <ListGroup as="ul" className="customers-list">
        {!isMobile &&
            <ListGroup.Item as="li" key={'header'}>
                <CustomerListItemLargeHeader></CustomerListItemLargeHeader>
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


const CustomerListItemLargeHeader: React.FC = () => {
    const [sort, setSort] = useState('name');
    const [direction, setDirection] = useState('ASC');

    const [searchParams, setSearchParams] = useSearchParams();

    const buildDirection = (name: string) => sort === name ? direction : 'ASC';
    const buildTo = (name: string) => `?sort=${name}&direction=${buildDirection(name)}`;

    useEffect(() => {
        if (searchParams && searchParams.get('sort') && searchParams.get('direction')) {
            const nextSort = searchParams.get('sort') ?? 'name';
            const d = searchParams.has('direction') && searchParams.get('direction') === 'ASC' ? 'DESC' : 'ASC';

            setSort(nextSort);
            setDirection(d);
        }
        else {
            setSort('name');
            setDirection('DESC');
        }
    }, [searchParams]);

    return (
        <span className="customer-item-head">
            <span>
                <Link to={buildTo('name')}>
                    <b>
                        Nome
                        {sort === 'name' && <SortIndicator name={'name'} direction={buildDirection('name')} />}
                    </b>
                </Link>
            </span>
            <span className="area" title="Zona in cui abita">
                <Link to={buildTo('area')}>
                    <b>
                        Zona
                        {sort === 'area' && <SortIndicator name={'area'} direction={buildDirection('area')} />}
                    </b>
                </Link>
            </span>
            <span title="Indirizzo consegna spesa">
                <b>Indirizzo</b>
            </span>
            <span title="Persona Referente">
                <Link to={buildTo('reference')}>
                    <b>
                        Referente
                        {sort === 'reference' && <SortIndicator name={'reference'} direction={buildDirection('reference')} />}
                    </b>
                </Link>
            </span>

            <span className="area" title="Teleforno fi riferimento">
                <b>Telefono</b>
            </span>

            <span className="latestDelivery" title="Data ultima consegna">
                <b>Consegna</b>
            </span>
            <span className="note" title="Richieste particolari">
                <SpecialIcon />
            </span>
        </span>
    )
}

const CustomerListItemLarge: React.FC<{ customer: Customer }> =
    ({ customer }) => {
        const deliveryDateFormatted = () =>
            customer.deliveries && customer.deliveries.length > 0 ? customer.deliveries[0].deliveryDate.toDateString() : '';

        return (
            <span className="customer-item">
                <Link to={"/customer/" + customer.id} className={"customer-link"}>
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
                <span className="note" title={'Richieste particolari'}>
                    {(customer.note && customer.note !== '') && <span title={customer.note}><SpecialIcon /></span>}
                </span>
                {customer.standby && <em title="Attualmente in standby">[S]</em>}
            </span >
        );
    }

const SpecialIcon = () =>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
    </svg>

const CustomerListItemSmall: React.FC<{ customer: Customer }> =
    ({ customer }) =>
        <span className="customer-item-xs">
            <Link to={"/customer/" + customer.id} className={"customer-link-xs"}>
                <span>
                    {customer.name}</span>
                <span className="area" title={'Zona: ' + (customer.area ? customer.area : '')}>
                    {customer.area ? customer.area : ''}
                </span>
            </Link>
            {customer.standby ? <em title="Attualmente in standby">[S]</em> : ''}
        </span>


export default CustomerList;