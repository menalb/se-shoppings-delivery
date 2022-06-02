import { doc, setDoc } from "firebase/firestore";
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