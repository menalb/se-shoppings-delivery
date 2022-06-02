import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotAuth = (props: any) => {
    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Utente non abilitato</h2>

                </Card.Body>
            </Card>            
        </>
    );
}

export default NotAuth;