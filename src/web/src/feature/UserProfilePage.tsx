import { useState } from "react";
import { Alert, Button, Card, Col, Container, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./UserProfilePage.css"

const UserProfilePage = () => {
    const [error, setError] = useState("");
    const auth = useAuth()
    const navigate = useNavigate();

    async function handleLogout() {
        setError("")

        if (auth.logout) {
            try {
                await auth.logout()
                navigate("/login")
            } catch {
                setError("Failed to log out")
            }
        }
    }
    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}
            <Card>
                <Card.Body>
                    <h2 className="mb-4">Profilo utente</h2>
                    <Container>
                        <Row>
                            Nome
                        </Row>
                        <Row>
                            <b>{auth.currentUser?.displayName ?? ''}</b>
                        </Row>
                        <Row>
                            Email:
                        </Row>
                        <Row>
                            <b>{auth.currentUser?.email ?? ''}</b>
                        </Row>
                        <Row>
                            Ruoli:
                        </Row>
                        <Row>
                            <ListGroup className="roles" as="ul">
                                {auth.roles.map((role, index) => <ListGroup.Item as="li" key={index}><b>{role}</b></ListGroup.Item>)}
                            </ListGroup>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Button onClick={handleLogout}>
                    Log Out
                </Button>
            </div>
        </>
    )
}


export default UserProfilePage;