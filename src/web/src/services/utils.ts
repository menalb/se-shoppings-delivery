import { useEffect, useState } from "react";

export const useCheckMobileScreen = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    return (width <= 768);
}

export const parseYearFromQueryString = (searchParams: URLSearchParams): number | 'parse-error' => {
    if (searchParams && searchParams.has('year')) {
        const year = parseInt(searchParams.get('year') ?? '');
        if (!isNaN(year) && Number.isInteger(year) && year > 0) {
            return year;
        }
    }
    return 'parse-error';
}

export const months = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];