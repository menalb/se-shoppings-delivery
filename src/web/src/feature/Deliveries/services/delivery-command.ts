import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { Delivery } from "../model";
import { getDeliveryByDay } from "./delivery-query";

export const updateDelivery = async (delivery: Delivery, userId: string): Promise<void> => {
    const docRef = doc(db, 'deliveries', delivery.id);

    const model: DeliveryCommand = mapToApi(delivery, userId);

    await setDoc(docRef, model);
}

export const addDelivery = async (delivery: Delivery, userId: string): Promise<Delivery> => {
    const collectionRef = collection(db, 'deliveries');
    const model: DeliveryCommand = mapToApi(delivery, userId);
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

const mapToApi = (delivery: Delivery, userId: string): DeliveryCommand => ({
    code: delivery.code,
    creationDate: delivery.creationDate ? delivery.creationDate : new Date(Date.now()),
    day: delivery.day,
    note: delivery.note,
    userId: userId
});

type DeliveryCommand = {
    code: string,
    day: Date,
    creationDate: Date,
    note: string,
    userId: string
}