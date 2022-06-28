import { collection, doc, DocumentData, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { NotFound, secondsToDate } from "../../../model";
import { getDeliveryByDay } from "../../Deliveries";
import { Customer, CustomerDelivery } from "../model";


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
export const customersQueryByDelivery = async (deliveryId: string): Promise<CustomerDelilveryDay[]> => { 
    const q = query(collection(db, 'customers'), orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(e => {
        const data = e.data();

        if (data.deliveries) {
            const any = (data.deliveries.map(mapCustomerDelivery) as CustomerDelivery[]).find(d => d.deliveryId === deliveryId);;

            return {
                kind: 'customer-delivery-day',
                id: e.id,
                name: data.name,
                area: data.area,
                day: any?.deliveryDate,
                deliveryId: any?.deliveryId
            }
        }
        return {
            kind: 'customer-delivery-day',
            id: e.id,
            name: data.name,
            area: data.area,

        }
    });
}
export const customersQueryByDate = async (day: Date): Promise<CustomerDelilveryDay[]> => {
    
    const delivery = await getDeliveryByDay(day);

    if (delivery.kind === 'delivery') {
        return customersQueryByDelivery(delivery.id);
    }
    return [];
}

export interface CustomerDelilveryDay {
    kind: 'customer-delivery-day',
    id: string,
    name: string,
    area: string,
    day?: Date,
    deliveryId?: string
}

const map = (data: DocumentData, id: string): Customer => ({
    kind: 'customer',
    id: id,
    customerId: data.customerId,
    code: data.code ? data.code : 0,
    name: data.name,
    creationDate: data.creationDdate,
    reference: data.reference,
    homeDelivery: data.homeDelivery ? data.homeDelivery : false,
    phone: data.phone,
    area: data.area,
    note: data.note ? data.note : '',
    address: data.address,
    familyStructure: data.familyStructure ? data.familyStructure : '',
    adults: data.adults ? data.adults : 0,
    children: data.children ? data.children : 0,
    standby: data.standby,
    linkMaps: data.linkMaps,
    deliveries: data.deliveries ? mapCustomerDeliveries(data.deliveries) : []
});

const mapCustomerDeliveries = (deliveries: any): CustomerDelivery[] => {
    return (deliveries.map(mapCustomerDelivery) as CustomerDelivery[]).sort((a, b) => {
        if (a.deliveryDate > b.deliveryDate) {
            return -1;
        }

        if (a.deliveryDate < b.deliveryDate) {
            return 1;
        }
        return 0;
    });
}
const mapCustomerDelivery = (data: any): CustomerDelivery => ({
    creationDate: secondsToDate(data.creationDate.seconds),
    deliveryDate: secondsToDate(data.deliveryDate.seconds),
    deliveryDay: secondsToDate(data.deliveryDay?.seconds ?? data.deliveryDate.seconds),
    note: data.note ?? '',
    customerId: data.customerId,
    deliveredBy: data.deliveredBy ? data.deliveredBy : '',
    deliveryId: data.deliveryId
});
