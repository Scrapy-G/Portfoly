import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { Col, Row, Button, Form, Alert, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { userState, selectUser, registerUser } from '../redux/slices/userSlice';
import { RotateLoader } from 'react-spinners';


export default function Signup() {

  const user = useSelector(selectUser);
  const userStatus = useSelector(userState);
  const error = useSelector(state => state.user.error);
  const dispatch = useDispatch();

  const usernameRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  function handleSignUp(e) {
    e.preventDefault();
    
    dispatch(registerUser({
      name: nameRef.current.value,
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
          <h1 className="mt-4 mb-5">Sign up</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSignUp}>
          <Form.Group>
              <Form.Control 
                ref={usernameRef}
                className="round px-4 py-3 my-3"
                type="text" 
                placeholder="Username" required
              />
              <Form.Control 
                ref={nameRef}
                className="round px-4 py-3 my-3"
                type="text" 
                placeholder="Name" required
              />
            </Form.Group>
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
              className="primary py-3 w-100 round mb-3"
              type="submit"
              disabled={userStatus === "loading"}
            >
                Sign up
            </Button>
          </Form>
          <p className="text-center">
            Already a member? <Link to='/login'>Log In</Link>
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
