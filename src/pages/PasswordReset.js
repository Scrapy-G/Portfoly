import { useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { auth } from '../firebase';
import { sendPasswordResetEmail } from "firebase/auth";
import { BeatLoader } from "react-spinners";
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { Link } from "react-router-dom";


export default function PasswordRest() {

    const emailRef = useRef();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    function handleReset() {

        setLoading(true);

        sendPasswordResetEmail(auth, emailRef.current.value)
        .then(() => {
            setSuccess(true);
            setLoading(false);
        })
        .catch((error) => {
            setError(error.message);
            setLoading(false);
        });
    }

    function renderSuccessScreen() {
        return (
            <div className="text-center">
                <AiOutlineCheckCircle color="var(--secondary)" size={100}/>
                <h5 
                    style={{ color: "var(--secondary-dark)" }}
                    className="mt-2"
                >
                    Password reset email sent!
                </h5>
                <Link to='/login'>
                    <Button variant="primary" className="large w-100 mt-4">
                        Back to login
                    </Button>                    
                </Link>
            </div>
        )
    }

    function renderResetForm() {
        return(
            <>
                {error &&
                    <Alert variant="danger">{error}</Alert>
                }
                <Form.Control 
                    ref={emailRef}
                    placeholder="Email address"
                    required
                />
                <Button
                    variant="primary"
                    className="large w-100"
                    onClick={handleReset}
                    disabled={loading}
                > 
                    {loading &&
                        <BeatLoader />
                        ||
                        "Reset password"
                    }
                </Button>
            </>
        )
    }

    return (
        <Container>
            <Row className="mt-5 justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <h1>Password reset</h1>
                    <div className="mt-5">
                       {success &&
                            renderSuccessScreen()
                            ||
                            renderResetForm()
                       }
                    </div>                    
                </Col>
            </Row>            
        </Container>
    )
}