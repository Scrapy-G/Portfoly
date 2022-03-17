import { useRef } from 'react';
import { Container, Col, Row, Button, Form, Alert } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import styles from './Background.module.css';
import { useUsersContext } from '../contexts/UserContext';

export default function Signin() {

  const { loggedInUser, loading, error, signInWithEmail } = useUsersContext();

  const emailRef = useRef();
  const passwordRef = useRef();

  function handleSignIn(e) {
    e.preventDefault();

    signInWithEmail({
      email: emailRef.current.value,
      password: passwordRef.current.value
    });
  }

  if(loggedInUser)
    return <Navigate to={`/${loggedInUser.username}`} />

  return (
    <Container className={styles.background}>
      <Row className="justify-content-center h-50 align-items-center">
        <Col xl={4} lg={6} md={8} sm={12}>
          <h1 className="my-5">Sign In</h1>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form>
            <Form.Group>
              <Form.Control 
                ref={emailRef}
                type="email" 
                placeholder="Email address" 
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Control 
                ref={passwordRef}
                type="password" 
                className="mb-1"
                placeholder="Password" 
                required
              />
              <div className="text-right">
                <Link to='/password-reset' className="small secondary text-decoration-none">Forgot password?</Link>
              </div>
            </Form.Group>

            <Button
              variant="primary"
              onClick={handleSignIn} 
              disabled={loading}
              className="large w-100 mb-3"
              type="submit">
                {loading && 
                  <div className="text-center">
                    <BeatLoader color="#373A74" />
                  </div>

                  || "Login"
                }
            </Button>
          </Form>

          {/* <p className="text-center small mt-3">
            or sign in with
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
          </div> */}

          <p className="text-center mt-2">
            Not a member? <Link to='/signup'>Sign up</Link>
          </p>
          
        </Col>
      </Row>
    </Container>
  );
}
