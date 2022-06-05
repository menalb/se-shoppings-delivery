import './Loader.css'
export const Loader = (props: { isLoading: boolean }) => {
    return (
        <div className="loader">
            {props.isLoading ?
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div> : ''}
        </div>
    );
}