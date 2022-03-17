import { Container, Form, Col, Row, Button } from "react-bootstrap";
import { useRef } from "react";
import { useUsersContext } from '../contexts/UserContext';
import { BsPerson } from 'react-icons/bs';
import styles from './Profile.module.css';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { useState } from 'react';

export default function EditProfile() {

    const { loggedInUser, loading, updateUser, updateProfileImage } = useUsersContext();
    const [uploading, setUploading] = useState(false);

    const name = useRef();
    const introduction = useRef();
    const about = useRef();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            name: name.current.value,
            introduction: introduction.current.value,
            about: about.current.value
        }

        await updateUser(data);
        navigate(-1);
    }

    const handleImageUpload = (e) => {
        setUploading(true);
        
        updateProfileImage(e.target.files[0])
        .then(() => setUploading(false));
    }

    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col sm={12} md={6} lg={4} className="text-center py-5">
                        <div className={styles.profileImage}>
                            {(
                                uploading && <BeatLoader color="var(--secondary)"/>
                            ) || (
                                loggedInUser?.photoUrl && <img src={loggedInUser.photoUrl} />
                                ||
                                <BsPerson size={40} />
                            )}
                        </div>
                        <label className="btn btn-secondary text-small mb-4 stroke">
                            Change photo
                            <input 
                                type="file" 
                                style={{ display: "none" }}
                                onChange={handleImageUpload}
                            />
                        </label>

                        <Form onSubmit={handleSubmit}>
                            <Form.Control
                                ref={name}
                                defaultValue={loggedInUser.name}
                                placeholder="Name"
                            />
                            <Form.Control
                                ref={introduction}
                                defaultValue={loggedInUser?.introduction}
                                placeholder="Introduction"
                            />
                            <Form.Control
                                as="textarea"
                                rows={5}
                                ref={about}
                                defaultValue={loggedInUser?.about}
                                placeholder="About"
                            />

                            <Button 
                                variant="primary" 
                                className="large w-100" 
                                type="submit"
                            >
                                {loading &&
                                    <BeatLoader color="#373A74" />
                                ||
                                    "Save"
                                }
                            </Button>
                            <Button 
                                variant="secondary" 
                                className=" mt-3 large w-100 stroke " 
                                onClick={() => navigate(-1)}                                
                            >
                                Cancel
                            </Button>
                        </Form>                      
                    </Col>
                </Row>
            </Container>
        </>
    )
}