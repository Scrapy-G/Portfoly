import { Container, Navbar, Button, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, signOutUser } from "../redux/slices/userSlice";
import { Link, useNavigate } from 'react-router-dom';
import { useReducer } from "react";
import { auth } from '../firebase';
import { deleteUser } from "firebase/auth";
import { useUsersContext } from '../contexts/UserContext';
import { AiOutlineDown } from 'react-icons/ai';

export default function Header(){

    const { loggedInUser, logOut } = useUsersContext();
    const navigate = useNavigate();

    const handleSignOut = () => {
        logOut();
        navigate('/login');
    }

    return (
        <Navbar style={{ backgroundColor: "#fff" }} sticky="top">
            <Container>
                <Link to='/' className="text-decoration-none navbar-brand">
                    <h5 className="m-0 small font-weight-normal">Portfoly</h5>
                </Link>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                
                {loggedInUser && 
                    <Dropdown>
                        <Dropdown.Toggle variant="none">
                            <span style={{ color: "var(--secondary)" }}>
                                {loggedInUser.username}
                            </span>
                            <AiOutlineDown size={16} color="var(--secondary)"/>
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ left: "initial", right: 0 }}>
                            <Link to={`/${loggedInUser.username}`} className="dropdown-item">
                                Profile
                            </Link>
                            <Dropdown.Divider/>
                            <Dropdown.Item 
                                className="text-muted"
                                onClick={handleSignOut}
                            >
                                Log out
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    ||
                    <>
                        <Link to="/login" className="btn btn-secondary stroke mx-2">Sign in</Link>
                        <Link to="/signup" className="btn btn-secondary">Sign up</Link>
                    </>
                }
                
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
