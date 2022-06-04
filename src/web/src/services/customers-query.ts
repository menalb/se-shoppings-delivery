import { collection, doc, DocumentData, getDoc, getDocs, orderBy, query, QueryDocumentSnapshot, QuerySnapshot, SnapshotOptions, where } from "firebase/firestore";
import { db } from "../firebase-config";
import { Customer, NotFound } from "../model";

export const customersQuery = async (): Promise<Customer[]> => {
    const q = query(collection(db, 'customers'), orderBy('name', 'asc'));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(e => map(e.data(), e.id));
}

export const getNextCustomerCode = async (): Promise<number> => {
    const collectionRef = collection(db, 'customers')
    const q = query(collectionRef, where("code", "!=", NaN));
    const querySnapshot = await getDocs(q);

    const codes: number[] = querySnapshot.docs.map(e => e.data().code);

    return codes.reduce((p, c) => c > p ? c : p) + 1;
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
    code: data.code ? data.code : 0,
    name: data.name,
    creationDate: data.creationDdate,
    reference: data.reference,
    phone: data.phone,
    area: data.area,
    note: data.note ? data.note : '',
    address: data.address,
    familyStructure: data.familyStructure ? data.familyStructure : '',
    standby: data.standby,
    linkMaps: data.linkMaps,
});