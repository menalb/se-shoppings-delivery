import './Loader.css'
export const Loader = (props: { isLoading: boolean }) => {
    return (
        <div className="loader">
            {props.isLoading ? <em>Caricamento lista in corso...</em> : ''}
        </div>
    );
}