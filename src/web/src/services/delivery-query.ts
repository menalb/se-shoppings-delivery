import { collection, doc, DocumentData, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase-config";
import { Delivery, NotFound, secondsToDate } from "../model";

export const deliveriesQuery = async (): Promise<Delivery[]> => {
    const q = query(collection(db, 'deliveries'), orderBy('day', 'desc'));

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

const map = (data: DocumentData, id: string): Delivery => ({
    code: data.code,
    creationDate: secondsToDate(data.creationDate.seconds),
    day: secondsToDate(data.day.seconds),
    id: id,
    kind: 'delivery',
    note: data.note ?? ''
});