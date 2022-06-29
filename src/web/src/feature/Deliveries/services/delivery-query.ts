import { collection, doc, DocumentData, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { NotFound, secondsToDate } from "../../../model";
import { Delivery } from "../model";

export const deliveriesQuery = async (): Promise<Delivery[]> => {
    const q = query(collection(db, 'deliveries'), orderBy('day', 'desc'));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(e => map(e.data(), e.id));
}

export const deliveriesQueryByYear = async (year: number): Promise<Delivery[]> => {
    const dtFrom = new Date(year, 0, 1);
    const dtTo = new Date(year + 1, 0, 1);
    const q = query(collection(db, 'deliveries'),
        where('day', '>=', dtFrom), where('day', '<', dtTo),
        orderBy('day', 'desc')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(e => map(e.data(), e.id));
}

export const getDelivery = async (deliveryId: string): Promise<Delivery | NotFound> => {
    const docRef = doc(db, 'deliveries', deliveryId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return map(docSnap.data(), deliveryId);
    }
    else {
        console.log('unable to find delivery ' + deliveryId);
        return { kind: 'not-found' };
    }
}

export const getDeliveryByDay = async (day: Date): Promise<Delivery | NotFound> => {
    const dtFrom = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const dtTo = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
    const q = query(collection(db, 'deliveries'), where('day', '>=', dtFrom), where('day', '<', dtTo));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return { kind: 'not-found' };
    }
    else {
        return querySnapshot.docs.map(e => map(e.data(), e.id))[0];
    }
}

const map = (data: DocumentData, id: string): Delivery => ({
    code: data.code,
    creationDate: secondsToDate(data.creationDate.seconds),
    day: secondsToDate(data.day.seconds),
    id: id,
    kind: 'delivery',
    note: data.note ?? ''
});