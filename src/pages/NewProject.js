import { useEffect, useReducer, useState } from 'react';
import { useInput } from '../hooks/input-hook';
import { Container, Form, Button } from 'react-bootstrap';
import { RotateLoader } from 'react-spinners';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import Loader from '../components/Loader';

export default function NewProject() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [titleInput, setTitle] = useInput("");
    const [visibility, setVisibility] = useState('private');

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
                    console.log(project);
                    setTitle(project.title);
                    setVisibility(project.visibility);
                }
                setLoading(false);
            }

            fetchProject();
        }
    }, []);

    if(loading) return <Loader />

    const handleSubmit = async (e) => {

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
            .then(() => navigate(`/projects/${projectId}/upload`))
            .catch(setError);
        }else {
            addDoc(collection(db, 'projects'), {
                ...newProject,
                user: auth.currentUser.uid
            })
            .then((ref) => navigate(`/projects/${ref.id}/upload`))
            .catch(setError);
        }        
    }    

    return (
        <Container>
            <h1 className="my-4">
                {projectId && 
                    "Edit Project" || "Create Project"
                }
            </h1>
            <div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Project title</Form.Label>
                        <Form.Control
                            {...titleInput}
                            className="px-3 py-3"
                            type="text" 
                            placeholder="Project title"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mt-4 mb-3">
                        <Form.Check 
                            type="switch"
                            id="custom-switch"
                            label={visibility == 'public' ? 
                                "Public. Anyone can view this project" : 
                                "Private. Only you can view this project" }
                            className="small"
                            checked={visibility == 'public'}
                            onChange={(e) => {
                                if(e.target.checked)
                                    setVisibility('public')
                                else
                                    setVisibility('private')
                            }}
                        />
                    </Form.Group>
                    <Button
                        variant="primary"
                        className="py-3 w-100 mb-3"
                        type="submit"
                    >
                        {projectId && 
                            "Save & Next" || "Create project"
                        }
                    </Button>
                </Form>
            </div>
        </Container>
    )
}