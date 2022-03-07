import { useEffect, useReducer, useState } from 'react';
import { useInput } from '../hooks/input-hook';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useUsersContext } from '../contexts/UserContext';
import Loader from '../components/Loader';
import Header from '../components/Header';

export default function NewProject() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [titleInput, setTitle] = useInput("");
    const [visibility, setVisibility] = useState('private');
    const { loggedInUser } = useUsersContext();

    const navigate = useNavigate();
    const params = useParams();
    const projectId = params.projectId;

    useEffect(() => {
        if(projectId){
            setLoading(true);

            const docRef = doc(db, "projects", projectId);

            const fetchProject = async () => {
                const docSnap = await getDoc(docRef);
                if(docSnap.exists()){
                    const project = docSnap.data();
                    setTitle(project.title);
                    setVisibility(project.visibility);
                }
                setLoading(false);
            }

            fetchProject();
        }
    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);

        const newProject = {
            title: titleInput.value,
            visibility,
            timestamp: serverTimestamp()
        }
        
        //create or overwrite project
        if(projectId){
            const docRef = doc(db, "projects", projectId);

            updateDoc(docRef, newProject)
            .then(() => navigate(`/${loggedInUser.username}/${projectId}`))
            .catch(setError);
        }else {
            addDoc(collection(db, 'projects'), {
                ...newProject,
                user: loggedInUser.username
            })
            .then((ref) => navigate(`/${loggedInUser.username}/${ref.id}`))
            .catch(setError);
        }        
    } 
    
    const renderButton = () => {

        return (
            <Button
                variant="primary"
                className="py-3 w-100 mt-3 large"
                type="submit"
                disabled={loading}
            >
                {
                    (
                        loading && 
                        <BeatLoader color='var(--secondary)'/>
                    )
                ||
                    (
                        projectId && 
                        "Save & Next" || 
                        "Create project"
                    )
                 
                }
            </Button>
        )
    }

    return (
        <Container>
            <Row>
                <Col sm={12} md={7} lg={5} xl={4}>
                    <h1 className="my-5">
                        {projectId && 
                            "Edit Project" || "New Project"
                        }
                    </h1>
                    <div>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Control
                                    {...titleInput}
                                    className="px-3 py-3 mb-3"
                                    type="text" 
                                    placeholder="Project title"
                                    disabled={loading}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Check 
                                    id="custom-switch"
                                    label={visibility == 'public' ? 
                                        "Public. Anyone can view this project" : 
                                        "Private. Only you can view this project" }
                                    className="text-muted"
                                    checked={visibility == 'private'}
                                    onChange={(e) => {
                                        if(e.target.checked)
                                            setVisibility('private')
                                        else
                                            setVisibility('public')
                                    }}
                                />
                            </Form.Group>
                            
                            {renderButton()}
                            <Button
                                variant="secondary"
                                className="stroke large my-3 w-100"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}