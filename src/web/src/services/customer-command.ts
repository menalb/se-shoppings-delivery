import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase-config";
import { Customer, CustomerApi, CustomerDelivery } from "../model";
import { getCustomer } from "./customers-query";

export const updateCustomer = async (customer: Customer): Promise<void> => {
    const docRef = doc(db, 'customers', customer.id);

    const model: CustomerApi = mapToApi(customer);

    await setDoc(docRef, model);
}

export const addCustomer = async (customer: Customer): Promise<Customer> => {
    const collectionRef = collection(db, 'customers');

    const model: CustomerApi = mapToApi(customer);

    const docRef = await addDoc(collectionRef, model);

    console.log(docRef.id);

    return ({
        ...model,
        kind: 'customer',
        id: docRef.id
    });
}

export const logDelivery = async (delivery: CustomerDelivery, userId: string): Promise<void> => {
    const deliveryToStore = { ...delivery, userId: userId, creationDate: new Date(Date.now()) };

    const customer = await getCustomer(delivery.customerId);
    if (customer.kind === 'customer') {
        const model: CustomerApi = mapToApi(customer);

        if (model.deliveries && model.deliveries.length > 0) {
            model.deliveries = model.deliveries.filter(d => d.deliveryId !== delivery.deliveryId);
            model.deliveries.push(deliveryToStore);
        }
        else {
            model.deliveries = [deliveryToStore];
        }


        const docRef = doc(db, 'customers', delivery.customerId);

        await setDoc(docRef, model);
    }
}

const mapToApi = (customer: Customer): CustomerApi => ({
    customerId: customer.customerId,
    code: customer.code ? customer.code : 0,
    name: customer.name,
    creationDate: customer.creationDate ? customer.creationDate : new Date(Date.now()),
    reference: customer.reference,
    homeDelivery: customer.homeDelivery ? customer.homeDelivery : false,
    phone: customer.phone,
    area: customer.area,
    note: customer.note ? customer.note : '',
    address: customer.address,
    familyStructure: customer.familyStructure ? customer.familyStructure : '',
    adults: customer.adults ? customer.adults : 0,
    children: customer.children ? customer.children : 0,
    standby: customer.standby ? customer.standby : false,
    linkMaps: customer.linkMaps,
    deliveries: customer.deliveries,
});