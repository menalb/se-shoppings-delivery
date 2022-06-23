

export interface Delivery {
    kind: 'delivery',
    id: string,
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

export const secondsToDate = (seconds: number): Date => new Date(seconds * 1000);

export interface NotFound {
    kind: 'not-found'
}