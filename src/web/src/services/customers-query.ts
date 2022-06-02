import { collection, doc, DocumentData, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase-config";
import { Customer, NotFound } from "../model";

export const customersQuery = async (): Promise<Customer[]> => {
    const q = query(collection(db, 'customers'), orderBy('name', 'asc'));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(e => map(e.data(), e.id));
}

export const getCustomer = async (customerId: string): Promise<Customer | NotFound> => {
    const docRef = doc(db, 'customers', customerId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return map(docSnap.data(), customerId);
    }
    else {
        console.log('unable to find customer ' + customerId);
        return { kind: 'not-found' };
    }
}

const map = (data: DocumentData, id: string): Customer => ({
    kind: 'customer',
    id: id,
    customerId: data.customerId,
    code: data.code,
    name: data.name,
    creationDate: data.creationDdate,
    reference: data.reference,
    phone: data.phone,
    area: data.area,
    note: data.note,
    address: data.address,
    familyStructure: data.familyStructure,
    standby: data.standby,
    linkMaps:data.linkMaps,
});