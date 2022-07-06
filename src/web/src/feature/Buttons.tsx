import { Button } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";

export const ListButton = (props: { to: string }) =>
(
    <Link className="link btn btn-primary mb-4" title="Elenco persone" to={props.to}>

        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-card-list" viewBox="0 0 16 16">
            <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
            <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
        </svg>
        <span className="button-name">
            Elenco
        </span>
    </Link>
);

export const ListCutomersButton = () => (
    <ListButton to={"/customers"}></ListButton>
)

export const ListDeliveriesButton = () => (
    <ListButton to={"/deliveries"}></ListButton>
)

// export const EditButton = (props: { customerId: string }) =>
// (
//     <Link className="link btn btn-primary mb-4" title="Modifica dati" to={"/edit/" + props.customerId}>

//         <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-card-list" viewBox="0 0 16 16">
//             <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
//             <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
//         </svg>
//         <span className="button-name">
//             Modifica
//         </span>
//     </Link>
// );

export const EditButton = (props: { customerId: string }) =>
(
    <Link className="link btn btn-primary mb-4" title="Modifica dati" to={"/edit/" + props.customerId}>
        <span className="button-name">
            Modifica
        </span>
    </Link>
);

export const AddButton = () => (
    <Link className="link add btn btn-primary mb-1" to="/add" title="Aggiungi nuovo">
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
        <span className="button-name">
            Aggiungi
        </span>
    </Link>
)

export const AddDeliveryButton = () => (
    <Link className="link add btn btn-primary mb-1" to="/deliveries/add" title="Aggiungi nuovo">
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
        <span className="button-name">
            Aggiungi
        </span>
    </Link>
)

export const DeliveriesButton = () => (
    <Link className="link btn btn-primary" to="/deliveries" title="Sezione Giri">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
        </svg>
        <span className="button-name">
            Giri
        </span>
    </Link>
)

export const DeliveriesChartsButton = () => (
    <Link className="link btn btn-secondary" to="/deliveries/charts" title="Visualizza Grafici Consegne">
        <span className="button-name">
            Grafici
        </span>
    </Link>
)


export const UserProfileButton = () => (
    <a href="/profile" title="Profilo utente">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
        </svg>
        <span className="sr-only">
            Profilo Utente
        </span>
    </a>
)

export const ExportReactCSV: React.FC<{ csvData: any, fileName: string }> = ({ csvData, fileName }) => {
    return (
        <CSVLink data={csvData} filename={fileName} className="link btn btn-secondary" title="esporta in formato CSV">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="d-none d-lg-inline bi bi-cloud-download" viewBox="0 0 16 16">
                <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z" />
                <path d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z" />
            </svg>
            <span className="button-name">
                Esporta
            </span>
        </CSVLink>
    )
}