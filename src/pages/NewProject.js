import { useRef, useReducer } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createProject } from '../redux/slices/projectSlice';
import { RotateLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';

export default function NewProject() {

    const projectTitle = useRef();
    const [isPrivate, setPrivate] = useReducer(oldVal => !oldVal, false);
    const status = useSelector(state => state.projects.status);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const redirect = (projectID) => {
        navigate(`/projects/${projectID}`);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        dispatch(createProject({
            title: projectTitle.current.value,
            isPrivate
        }))
            .then(unwrapResult)
            .then(project => {
                redirect(project.id);
            });
    }    

    return (
        <Container>
            <h1 className="my-4">New Project</h1>
            <div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Project title</Form.Label>
                        <Form.Control
                            ref={projectTitle}
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
                            label="Private. Only you and persons with link can view this project."
                            className="small"
                            checked={isPrivate}
                            onChange={setPrivate}
                        />
                    </Form.Group>
                    {status === "loading" && 
                        <div className="text-center">
                            <RotateLoader />
                        </div>
                    }
                    <Button
                        variant="primary"
                        className="py-3 w-100 mb-3"
                        type="submit"
                        disabled={status === "loading" ? true : false}
                    >
                        Create project
                    </Button>
                </Form>
            </div>
        </Container>
    )
}