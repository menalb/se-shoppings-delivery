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

    const [searchParams] = useSearchParams();

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
            <span className="" title="Dati mancanti per la persona">
                <ExclamationTriangleIcon />
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
                <span className="icon" title={'Richieste particolari'}>
                    {(customer.note && customer.note !== '') && <span title={customer.note}><SpecialIcon /></span>}
                </span>
                <span className="icon" title={'ISEE non consegnato'}>
                    {!customer.documentationDeliveredOn && <ExclamationTriangleIcon />}
                </span>
                {customer.standby && <em title="Attualmente in standby">[S]</em>}
            </span >
        );
    }

const SpecialIcon = () =>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
    </svg>

const ExclamationTriangleIcon = () =>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle" viewBox="0 0 16 16">
        <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
        <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
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