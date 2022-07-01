import { useEffect, useState } from "react";
import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Delivery } from "./model";
import { deliveriesQueryByYear } from "./services/delivery-query";
import { ButtonActionsComponent, SecondaryLinkComponent } from "../ActionButtons";
import { Loader } from "../Loader";
import { AddDeliveryButton, DeliveriesChartsButton } from "../Buttons";
import { useAuth } from "../../context";
import './DeliveriesPage.css'
import { months } from "../../services/utils";
import { YearsSelector } from "../YearsSelectorComponent";

export const DeliveriesPage = () => {
    const currentYear = new Date(Date.now()).getFullYear();

    const { currentUser, roles } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [deliveries, setDeliveries] = useState([] as Delivery[]);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const isAdmin = (): boolean => {
        return !!currentUser && roles.some(r => r === 'admin');
    }

    const fetchDeliveries = async () => {
        setIsLoading(true);

        const deliveries = await deliveriesQueryByYear(selectedYear);

        setDeliveries(deliveries);
        setIsLoading(false);
    }

    const yearsSelected = (year: number) => {
        setSelectedYear(year);
    }

    const groupByMonth = (deliveries: Delivery[]): Record<number, Delivery[]> => {
        let group: any = deliveries.reduce((groups, a) => {
            const m = new Date(a.day).getMonth();
            if (!groups[m]) {
                groups[m] = [a];
            }
            else {
                groups[m].push(a);
            }

            return groups
        }, {} as Record<number, Delivery[]>);

        return group;
    }

    const getMonthFromGroup = (group: [any, Delivery[]]): string => {
        const [month] = group;
        return months[month];
    }

    const getDeliveryFromGroup = (group: [any, Delivery[]]): Delivery[] => {
        const [_, deliveries] = group;
        return deliveries;
    }

    useEffect(() => {
        fetchDeliveries();
    }, [selectedYear]);

    return (<>
        <Container className="deliveries-container">
            <h2 className="text-center">Giri</h2>
            <Row className="year-picker"><Col xs={10}>
                <YearsSelector yearFrom={2020} yearTo={currentYear} onclick={yearsSelected} selectedYear={selectedYear} />
            </Col>
                <Col xs={2} className="d-flex flex-row-reverse">
                    <DeliveriesChartsButton />
                </Col>
            </Row>
            <Loader isLoading={isLoading}></Loader>
            <div className="deliveries-list">
                {Object.entries(groupByMonth(deliveries)).reverse().map(m =>
                    <div key={getMonthFromGroup(m)}>
                        <h4>{getMonthFromGroup(m)}</h4>
                        <ListGroup as="ul">
                            {getDeliveryFromGroup(m).map(d =>
                                <ListGroup.Item as="li" key={d.id}>

                                    <Row><Col xs={2}>
                                        Giorno:
                                    </Col>
                                        <Col xs={6}>
                                            <b><Link to={"/deliveries/edit/" + d.id}>{d.day.toDateString()}</Link></b>
                                        </Col>
                                        <Col xs={4}>
                                            <Link to={"/deliveries/board/" + d.id}>Distribuzioni</Link>
                                        </Col>
                                    </Row>
                                    <Row><Col xs={2}>
                                        Note:
                                    </Col>
                                        <Col xs={8}>
                                            {d.note}
                                        </Col>
                                    </Row>

                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </div>

                )}
            </div>

            <ButtonActionsComponent
                left={<SecondaryLinkComponent link="/customers" text="Elenco Persone" title="Torna all'elenco delle persone" />}
                right={isAdmin() ?
                    <AddDeliveryButton></AddDeliveryButton>
                    : <></>}
            />
        </Container>
    </>)
}

