
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
    note?: string,
    address?: string,
    phone?: string,
    standby?: boolean,
    linkMaps?: string,
}


export interface NotFound {
    kind: 'not-found'
}