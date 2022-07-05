import { useEffect, useState } from "react";
import { useAuth } from "../../../context";
import { Loader } from "../../Loader";
import { Delivery } from "../model";
import { deliveriesQuery, deliveriesQueryByYear } from "../services/delivery-query";
import { customersQuery } from "../../Customers";
import { Customer } from "../../Customers/model";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, BarChart, Bar, AreaChart, ReferenceLine, Area, LabelList } from 'recharts';
import { Col, Row } from "react-bootstrap";
import { YearsSelector } from "../../YearsSelectorComponent";
import { SecondaryLinkComponent } from "../../ActionButtons";
import './DeliveriesChartPage.css'


export const DeliveriesChartPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const { currentUser } = useAuth();
    const [deliveries, setDeliveries] = useState([] as Delivery[]);
    const [allDeliveries, setAllDeliveries] = useState([] as Delivery[]);
    const [customers, setCustomers] = useState([] as Customer[]);
    const currentYear = new Date(Date.now()).getFullYear();

    const [selectedYear, setSelectedYear] = useState(currentYear);

    const fetchCustomers = async () => {
        setIsLoading(true);

        const customers = await customersQuery();
        setCustomers(customers);
        setIsLoading(false);
    }

    const fetchDeliveries = async () => {
        setIsLoading(true);
        const deliveries = await deliveriesQueryByYear(selectedYear);
        setDeliveries(deliveries);
        setIsLoading(false);
    }

    const fetchAllDeliveries = async () => {
        setIsLoading(true);
        const deliveries = await deliveriesQuery();
        setAllDeliveries(deliveries);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchCustomers();
        fetchDeliveries();
        fetchAllDeliveries();
    }, [currentUser]);

    useEffect(() => {
        fetchDeliveries();
        fetchCustomers();
    }, [selectedYear])

    const containsDelivery = (deliveryId: string, customer: Customer) => {
        return customer.deliveries.some(d => d.deliveryId === deliveryId);
    }

    const customersInDelivery = (deliveryId: string,) => {
        return customers.reduce((tot, a) => {
            if (containsDelivery(deliveryId, a)) {
                tot += 1;
            }
            return tot;
        }, 0);
    }
    const [data, setData] = useState([] as { deliveryId: string, day: Date, dayText: string, count: number }[]);
    const [allData, setAllData] = useState([] as { deliveryId: string, day: Date, dayText: string, count: number }[]);

    const buildChartData = (deliveries: Delivery[]) => {
        return deliveries
            .map(d => ({ deliveryId: d.id, day: d.day, count: customersInDelivery(d.id), dayText: `${d.day.getDate()}/${d.day.getMonth() + 1}/${d.day.getFullYear()}` }))
            .sort((a, b) => {
                if (a.day > b.day) {
                    return 1;
                }

                if (a.day < b.day) {
                    return -1;
                }
                return 0;
            })
    }

    useEffect(() => {
        if (customers && customers.length > 0) {
            setIsLoading(true);
            if (customers && customers.length > 0) {
                setData(buildChartData(deliveries));
            }
            setIsLoading(false);
        }
    }, [customers, deliveries]);

    useEffect(() => {
        if (customers && customers.length > 0) {
            setIsLoading(true);
            if (customers && customers.length > 0) {
                setAllData(buildChartData(allDeliveries));
            }
            setIsLoading(false);
        }
    }, [allDeliveries, customers]);

    const renderCustomAxisTick: (args: ({ x: number, y: number, payload: any })) => JSX.Element =
        ({ x, y, payload }) => {
            const dt = payload.value as Date;
            return <text>{dt.getMonth()}</text>
        };

    const renderCustomBarLabel: (args: { x: number, y: number, width: number, height: number, value: number }) => JSX.Element =
        ({ x, y, width, height, value }) => {

            return <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>{value > 0 ? value : ''}</text>;
        };

    return (
        <>
            <Row>
                <Col>
                    <SecondaryLinkComponent link="/deliveries" text="Elenco consegne" title="Torna all'elenco delle consegne" />
                </Col>
            </Row>

            <h3 className="text-center">
                Consegne per anno
            </h3>

            <Row className="year-picker"><Col xs={10}>
                <YearsSelector yearFrom={2020} yearTo={currentYear} onclick={setSelectedYear} selectedYear={selectedYear} />
            </Col>
            </Row>
            <Loader isLoading={isLoading} />
            <BarChart data={data} width={800} height={500} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <Bar dataKey="count" fill="#8884d8" label={renderCustomBarLabel} />
                <YAxis type="number" dataKey="count" >

                </YAxis>
                <XAxis type="category" dataKey="dayText" height={80} tick={<CustomizedAxisTick />} />
                <Tooltip />
            </BarChart>
            <h3 className="text-center">Andamento negli anni</h3>
            <LineChart
                width={800}
                height={300}
                data={allData}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dayText" />
                <YAxis />
                <Tooltip />
                <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </>
    );
}


const CustomizedAxisTick: React.FC<any> = (props: any) => {
    const { x, y, payload } = props;

    return (
        <g transform={`translate(${x}, ${y})`}>
            <text
                x={0}
                y={0}
                dy={16}
                textAnchor="end"
                fill="#666"
                transform="rotate(-35)"
            >
                {payload.value}
            </text>
        </g>
    );
};