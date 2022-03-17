import { Container, Navbar, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
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
        <Navbar style={{ backgroundColor: "#fff", backdropFilter: "blur(5px)", borderBottom: "1px solid var(--gray-200)" }} sticky="top">
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
                        <Link to="/login" className="mx-3 text-decoration-none">Sign in</Link>
                        <Link to="/signup" className="btn btn-secondary">Sign up</Link>
                    </>
                }
                
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
