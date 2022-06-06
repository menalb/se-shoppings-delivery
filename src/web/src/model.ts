
export interface Customer {
    kind: 'customer',
    id: string,
    name: string,
    customerId?: number,
    code?: number,
    area?: string,
    creationDate?: Date,
    reference?: string,
    familyStructure?: string,
    adults?: number,
    children?: number,
    homeDelivery?: boolean,
    note?: string,
    address?: string,
    phone?: string,
    standby?: boolean,
    linkMaps?: string,
}


export interface NotFound {
    kind: 'not-found'
}