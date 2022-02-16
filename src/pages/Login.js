import React, { useEffect, useRef } from 'react';
import { Container, Col, Row, Button, Form, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { loginNewUser, userState, selectUser } from '../redux/slices/userSlice';
import { RotateLoader } from 'react-spinners';

export default function Login() {

  const user = useSelector(selectUser);
  const userStatus = useSelector(userState);
  const error = useSelector(state => state.user.error);
  const dispatch = useDispatch();

  const emailRef = useRef();
  const passwordRef = useRef();

  function handleLogin(e) {
    e.preventDefault();
    dispatch(loginNewUser({
      email: emailRef.current.value,
      password: passwordRef.current.value
    }));
  }

  if(user)
    return <Navigate to='/profile' />

  return (
    <Container>
      <Row>
        <Col xl={4} sm={12}>
          <h1 className="mt-4 mb-5">Login</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group>
              <Form.Control 
                ref={emailRef}
                className="round px-4 py-3 my-3"
                type="email" 
                placeholder="Email address" required
              />
            </Form.Group>
            <Form.Group>
              <Form.Control 
                ref={passwordRef}
                className="round px-4 py-3 my-3"
                type="password" 
                placeholder="Password" required
              />
            </Form.Group>
            {userStatus === "loading" && 
              <div className="text-center">
                <RotateLoader />
              </div>
            }
            <Button
              onClick={handleLogin} 
              disabled={userStatus === "loading"}
              className="primary py-3 w-100 round mb-3"
              type="submit">
                Login
            </Button>
          </Form>
          <p className="text-center">
            Not a member? <Link to='/signup'>Sign up</Link>
          </p>

          <div className="divider my-4">
            <span className="mx-3">or</span>
          </div>
          <Button 
            variant="secondary" 
            className="red py-3 w-100 round"
          >
            Sign in with Google
          </Button>
          
        </Col>
      </Row>
    </Container>
  );
}
