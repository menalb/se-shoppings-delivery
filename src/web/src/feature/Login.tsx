import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { Loader } from "./Loader";


function Login() {


    const emailRef = useRef({} as HTMLInputElement)
    const passwordRef = useRef({} as HTMLInputElement)
    const { currentUser, login } = useAuth()
    const [error, setError] = useState("")
    const [isLoading, setLoading] = useState(false)
    const navigate = useNavigate();

    async function handleSubmit(e: any) {
        e.preventDefault()

        try {
            setError("")
            setLoading(true)
            if (login) {
                await login(emailRef.current.value, passwordRef.current.value);
                navigate("/customers");
            }
        } catch {
            setError("Failed to log in")
        }

        setLoading(false)
    }

    useEffect(() => {
        if (currentUser) {
            navigate("/customers");   
        }
    },[currentUser])

    return (
        <>
            <Card className="login">
                <Card.Body>
                    <h2 className="text-center mb-4">Log In</h2>
                    <Loader isLoading={isLoading}></Loader>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        <div className="buttons">
                            <Button disabled={isLoading} className="w-100" type="submit">
                                Log In
                            </Button>
                        </div>
                    </Form>
                    {/* <div className="w-100 text-center mt-3">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div> */}
                </Card.Body>
            </Card>
        </>
    );
}

export default Login;