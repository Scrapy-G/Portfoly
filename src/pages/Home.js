import { Button, Container, Row, Col } from 'react-bootstrap';
import { MyButton } from '../components/buttons/button';
import { Link } from 'react-router-dom';

export default function Home () {
    
    return (
        <Container>
            <Row>
                <Col xs={12} sm={6}>
                    <Link to='/signup'>
                        <MyButton size="lg" variant="primary" round={true}>
                            Sign up
                        </MyButton>
                    </Link>
                    <Link to='/login'>
                        <MyButton size="lg" variant="secondary" round={true}>
                            Login
                        </MyButton>
                    </Link>

                    
                </Col>
            </Row>
        </Container>
    )
}