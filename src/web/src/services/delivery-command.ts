import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase-config";
import { Delivery, DeliveryApi } from "../model";


export const addDelivery = async (delivery: Delivery): Promise<Delivery> => {
    const collectionRef = collection(db, 'deliveries');
    const model: DeliveryApi = mapToApi(delivery);

    const docRef = await addDoc(collectionRef,
        model
    );

    console.log(docRef.id);

    return ({
        kind: 'delivery',
        ...model,
        id: docRef.id
    });
}

const mapToApi = (delivery: Delivery): DeliveryApi => ({
        code: delivery.code,
        creationDate: delivery.creationDate ? delivery.creationDate : new Date(Date.now()),
        day: delivery.day,
        note: delivery.note,
    });