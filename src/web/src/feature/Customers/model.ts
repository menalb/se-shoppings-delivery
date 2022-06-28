export interface Customer {
    kind: 'customer',
    id: string,
    name: string,
    customerId?: number,
    code?: number,
    area: string,
    creationDate: Date,
    reference: string,
    familyStructure: string,
    adults: number,
    children: number,
    homeDelivery: boolean,
    note: string,
    address: string,
    phone: string,
    standby: boolean,
    linkMaps: string,
    deliveries: CustomerDelivery[]
}
export interface CustomerDelivery {
    deliveryId: string,
    customerId: string,
    note: string;
    userId?: string,
    deliveryDate: Date,
    deliveryDay: Date,
    deliveredBy: string,
    creationDate?: Date,
}