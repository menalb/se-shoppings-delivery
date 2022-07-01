import { Button } from "react-bootstrap";

export const YearsSelector: React.FC<{ yearFrom: number, yearTo: number, selectedYear?: number, onclick: (year: number) => void }> =
    ({ yearFrom, yearTo, selectedYear, onclick }) => {

        function range(start: number, end: number) {
            const items = [];
            for (let i = start; i <= end; i++) {
                items.push(i);
            }
            return items;
        }

        return <>
            {range(yearFrom, yearTo).map(y =>
                <Button key={y} className={`btn ${selectedYear && selectedYear === y ? 'btn-secondary' : 'btn-primary'}`} title={`Filtra per anno ${y}`} onClick={() => onclick(y)} >
                    <span className="button-name">
                        {y}
                    </span>
                </Button>
            )}
        </>
    } 