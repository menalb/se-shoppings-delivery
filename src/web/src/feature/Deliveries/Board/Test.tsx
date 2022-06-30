import { useEffect, useState } from "react";
import { useAuth } from "../../../context";
import { Loader } from "../../Loader";
import { Delivery } from "../model";
import { deliveriesQuery } from "../services/delivery-query";
import { CustomerDelilveryDay, customersQuery, customersQueryByDelivery } from "../../Customers";
import { Customer } from "../../Customers/model";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, BarChart, Bar } from 'recharts';

export const TestPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const { currentUser, roles } = useAuth();
    const [deliveries, setDeliveries] = useState([] as Delivery[]);
    const [customers, setCustomers] = useState([] as Customer[]);

    const fetchCustomers = async () => {
        setIsLoading(true);

        const customers = await customersQuery();
        setCustomers(customers);
        setIsLoading(false);
    }

    const fetchDeliveries = async () => {
        setIsLoading(true);
        const deliveries = await deliveriesQuery();
        setDeliveries(deliveries);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchCustomers();
        fetchDeliveries();
    }, [currentUser]);

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
    const [data, setData] = useState([] as { deliveryId: string, day: Date, count: number }[]);

    useEffect(() => {
        setIsLoading(true);
        if (customers && customers.length > 0) {
            setData(deliveries
                .map(d => ({ deliveryId: d.id, day: d.day, count: customersInDelivery(d.id) }))
                .sort((a, b) => {
                    if (a.day > b.day) {
                        return 1;
                    }

                    if (a.day < b.day) {
                        return -1;
                    }
                    return 0;
                }))
        }
        setIsLoading(false);
    }, [customers]);

    //const data = [{ name: 'Page A', uv: 400, pv: 2400, amt: 2400 }];

    return (
        <>
            <Loader isLoading={isLoading} />


            <BarChart width={800} height={400} data={data}>
                {/* <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis type="category" dataKey="day" />
                    <YAxis type="number" dataKey="count" />
                    <Tooltip />
                    <Scatter name="A school" data={data} fill="#8884d8" /> */}
                <Bar dataKey="count" fill="#8884d8" />
                <YAxis type="number" dataKey="count" />
                <XAxis type="category" dataKey="day" />
                <Tooltip />
            </BarChart>


        </>
    );
}
