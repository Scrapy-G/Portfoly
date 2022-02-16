import { Container, Navbar, DropdownButton, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, signOutUser } from "../redux/slices/userSlice";
import { Link, useNavigate } from 'react-router-dom';
import { useReducer } from "react";

export default function Header(){
    
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignOut = () => {
        dispatch(signOutUser());
        navigate('/');
    }

    const DropdownMenu = () => {

        const [toggle, setToggle] = useReducer(oldValue => !oldValue, false);

        return (
            <div 
                className="btn btn-secondary dropdown-toggle position-relative"
                onClick={setToggle}
            >
                {user}
                {toggle && 
                    <div className="nav-dropdown-menu position-absolute top-100 end-0 py-2">
                        <Link to='/' className="text-decoration-none">
                            <div className="py-2 px-4">Create project</div>
                        </Link>
                        <Link to='/edit-profile' className="text-decoration-none">
                            <div className="py-2 px-4">Edit profile</div>
                        </Link>
                        <div 
                            className="py-2 px-4 border"
                            onClick={handleSignOut}
                        >
                            Log out
                        </div>                        
                    </div>
                }
            </div>
        )
    }

    return (
        <Navbar>
            <Container>
                <Link to='/' className="text-decoration-none navbar-brand">
                    <p className="m-0 small">Portfoly</p>
                </Link>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    {user && 
                        <DropdownMenu />
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
