import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { Customer, CustomerDelivery } from "../model";
import { getCustomer } from "./customers-query";

export const updateCustomer = async (customer: Customer): Promise<void> => {
    const docRef = doc(db, 'customers', customer.id);

    const model: CustomerCommand = buildUpdateCommand(customer);

    await setDoc(docRef, model);
}

export const addCustomer = async (customer: Customer): Promise<Customer> => {
    const collectionRef = collection(db, 'customers');

    const model: CustomerCommand = buildUpdateCommand(customer);

    const docRef = await addDoc(collectionRef, model);

    console.log(docRef.id);

    return mapToCustomer(model, docRef.id);
}

const mapToCustomer = (command: CustomerCommand, id: string): Customer => ({
    ...command,
    kind: 'customer',
    id: id,
});

export const logDelivery = async (delivery: CustomerDelivery, userId: string): Promise<CustomerDelivery> => {
    const deliveryToStore = { ...delivery, userId: userId, creationDate: new Date(Date.now()) };
    console.log(delivery.deliveryId)
    const customer = await getCustomer(delivery.customerId);
    if (customer.kind === 'customer') {
        const model: CustomerCommand = buildUpdateCommand(customer);

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
    return deliveryToStore;
}

export const removeDelivery = async (delivery: CustomerDelivery, userId: string): Promise<void> => {
    const customer = await getCustomer(delivery.customerId);
    if (customer.kind === 'customer') {
        const model: CustomerCommand = buildUpdateCommand(customer);

        if (model.deliveries && model.deliveries.length > 0) {
            model.deliveries = model.deliveries.filter(d => d.deliveryId !== delivery.deliveryId);
        }

        const docRef = doc(db, 'customers', delivery.customerId);

        await setDoc(docRef, model);
    }
}

const buildUpdateCommand = (customer: Customer): CustomerCommand => ({
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
    deliveries: customer.deliveries ?? [],
});

interface CustomerCommand {
    name: string,
    customerId?: number,
    code?: number,
    area: string,
    creationDate: Date,
    reference: string,
    familyStructure: string,
    adults: number,
    children: number,
    homeDelivery: boolean,
    note: string,
    address: string,
    phone: string,
    standby: boolean,
    linkMaps: string,
    deliveries: CustomerDelivery[]
}