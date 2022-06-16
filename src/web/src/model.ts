export interface Customer extends CustomerBase {
    kind: 'customer',
    id: string,
}
export interface CustomerBase {
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

export interface CustomerApi extends CustomerBase { }


export interface Delivery extends DeliveryBase {
    kind: 'delivery',
    id: string
}

export type DeliveryApi = DeliveryBase & { userId?: string }

interface DeliveryBase {
    code: string,
    day: Date,
    creationDate: Date,
    note: string,
}

export const formatDeliveryCode = (day?: Date): string =>
    day ?
        `${day.getDate().toString().padStart(2, '0')}-${(day.getMonth() + 1).toString().padStart(2, '0')
        }-${day.getFullYear()}` : '';

export const formatDateCalendar = (day: Date): string =>
    day ?
        `${day.getFullYear()}-${(day.getMonth() + 1).toString().padStart(2, '0')}-${day.getDate().toString().padStart(2, '0')}` : '';



export interface NotFound {
    kind: 'not-found'
}