import { Container, Form, Col, Row } from "react-bootstrap";
import { MyButton } from "../components/buttons/button";
import cover from '../assets/cover.png';
import profile from '../assets/profile.png';
import { useDispatch, useSelector } from "react-redux";
import { selectUser, updateUserProfile } from "../redux/slices/userSlice";
import { addDoc, collection, db } from '../firebase';
import { useRef } from "react";

export default function EditProfile() {

    const user = useSelector(selectUser);
    const name = useRef();
    const introduction = useRef();
    const about = useRef();

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();

        // addDoc(collection(db, 'users'), {
        //     name: name.current.value,
        //     introduction: introduction.current.value,
        //     about: about.current.value
        // })

        dispatch(updateUserProfile({
            name: name.current.value,
            intro: introduction.current.value,
            about: about.current.value
        }))
        
    }

    return (
        <>
            <Container>
                <h1 className="my-4">Edit Profile</h1>
            </Container>
            <div>
                <div className="cover-image">
                    <img src={cover} />
                </div>
                <Container>
                    <div className="profile-image">
                        <img src={profile} />
                    </div>
                </Container>
            </div>
            <Container>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            ref={name}
                            className="px-3 py-3"
                            type="text" 
                            placeholder="Name" required
                            defaultValue={user}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className=''>Introduction</Form.Label>
                        <Form.Control
                            ref={introduction}
                            as="textarea"
                            className="px-3 py-3"
                            placeholder="Introduction" required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>About</Form.Label>
                        <Form.Control
                            ref={about}
                            as="textarea"
                            className="px-3 py-3"
                            placeholder="About" required
                        />
                    </Form.Group>
                    <MyButton type="submit" size="lg" variant="primary" round={false}>
                        Save
                    </MyButton>
                </Form>
            </Container>
        </>
    )
}