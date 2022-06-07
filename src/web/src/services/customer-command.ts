import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase-config";
import { Customer, CustomerApi } from "../model";

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
});