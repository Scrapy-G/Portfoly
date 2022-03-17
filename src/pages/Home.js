import { Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './Background.module.css';
import { BsPerson } from 'react-icons/bs';

export default function Home () {

    return (
        <Container 
            className={styles.background}
            style={{ height: "80vh" }}
        >
            <Row className="h-100 align-items-center">
                <Col>
                    <Row>
                        <Col>
                            <h2 className="text-large text-center">
                                Portfoly
                            </h2>
                            <h5 className="text-center my-5">
                                Manage and share your<br/>
                                graphic design project files
                                <br /> with ease.
                            </h5>
                        </Col>                
                    </Row>
                    <Row className="justify-content-center">
                        <Col xs={10} sm={5} md={3} lg={2}>
                            <Link to='/signup'>
                                <Button className="large mb-3 w-100" variant="primary">
                                    Sign up
                                </Button>
                            </Link>
                        </Col>
                        <Col xs={10} sm={5} md={3} lg={2}>
                            <Link to='/login'>
                                <Button className="large w-100" variant="secondary stroke">
                                    Login
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                    
                    <div className="mt-5 text-center">
                        <Link to='/mike123' 
                            style={{ width: "fit-content", margin: "auto" }} 
                            className="d-block mb-1"
                        >                            
                            <div 
                                className="d-flex justify-content-center align-items-center round"
                                style={{ width: "80px", height: "80px", backgroundColor: "var(--gray-200)" }}
                            >
                                <BsPerson size={40} />
                            </div>
                        </Link>
                        <p style={{ color: "var(--gray-600)" }}>Test account</p>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}