import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase-config";
import { Customer } from "../model";

export const updateCustomer = async (customer: Customer): Promise<void> => {
    const docRef = doc(db, 'customers', customer.id);

    await setDoc(docRef,
        {
            ...customer,
            creationDate: customer.creationDate ? customer.creationDate : Date.now(),
            standby: customer.standby ? customer.standby : false
        }
    );
}

export const addCustomer = async (customer: Customer): Promise<Customer> => {
    const collectionRef = collection(db, 'customers');

    const docRef = await addDoc(collectionRef,
        {
            ...customer,
            creationDate: customer.creationDate ? customer.creationDate : Date.now(),
            standby: customer.standby ? customer.standby : false
        }
    );

    console.log(docRef.id);
    
    return ({
        ...customer,
        id: docRef.id
    });
}