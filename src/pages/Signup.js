import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { Col, Row, Button, Form, Alert, Container } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { BsTwitter, BsGoogle } from 'react-icons/bs';
import { RiInstagramFill } from 'react-icons/ri';
import styles from './Background.module.css';
import { useUsersContext } from '../contexts/UserContext';

export default function Signup() {

  const { loggedInUser, loading, error, createUserWithEmail } = useUsersContext();

  const usernameRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  function handleSignUp(e) {
    e.preventDefault();

    createUserWithEmail({
      username: usernameRef.current.value,
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value
    });
  }

  if(loggedInUser)
    return <Navigate to={`/${loggedInUser.username}`} />

  return (
    <Container className={styles.background}>
      <Row className="justify-content-center h-100 align-items-center">
        <Col xl={4} sm={12} md={8}>
          <h1 className="my-5">Sign up</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSignUp}>
          <Form.Group>
              <Form.Control 
                ref={usernameRef}
                type="text" 
                placeholder="Username" required
              />
              <Form.Control 
                ref={nameRef}
                type="text" 
                placeholder="Name" required
              />
            </Form.Group>
            <Form.Group>
              <Form.Control 
                ref={emailRef}
                type="email" 
                placeholder="Email address" required
              />
            </Form.Group>
            <Form.Group>
              <Form.Control 
                ref={passwordRef}
                type="password" 
                placeholder="Password" required
              />
            </Form.Group>
            <Button 
              variant="primary"
              className="large w-100"
              type="submit"
              disabled={loading}
            >
              {loading && 
                  <BeatLoader color="#373A74" />
                || 
                  "Sign up"
              }
            </Button>
          </Form>

          <p className="text-center small mt-3">
            or sign up with
          </p>
          <div className="mb-5 text-center">
            <Button variant="secondary round mx-2">
                <BsTwitter size={25}/>
            </Button>
            <Button variant="secondary round mx-2">
                <BsGoogle size={20}/>
            </Button>
            <Button variant="secondary round mx-2">
                <RiInstagramFill size={25}/>
            </Button>
          </div>

          <p className="text-center">
            Already a member? <Link to='/login'>Sign in</Link>
          </p>

        </Col>
      </Row>
    </Container>
  );
}
