import { Container, Button, Row, Col } from "react-bootstrap";
import DragDrop from '../components/File/DragDrop';
import { FileUpload, ProjectFile } from "../components/File/FileUpload";
import { useEffect, useState, useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import { auth } from '../firebase';
import { getStorage, ref, listAll } from 'firebase/storage';

export default function ManageFiles () {

    const [newFiles, addFiles ] = useReducer((oldFiles, newFile) =>[...oldFiles, ...newFile], []);
    const [projectFiles, setProjectFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    const params = useParams();
    const storage = getStorage();
    const projectId = params.projectId;
    const projectPath = auth.currentUser.uid + "/" + projectId + "/";

    useEffect(() => {
        const listRef = ref(storage, projectPath);
        listAll(listRef)
            .then(res => {
                setProjectFiles(res.items);
            })
    }, [projectId]);

    return (
        <>
            <Container>
                <Row className="mb-4">
                    <Col>
                        <h1 className="my-4">Title</h1>
                    </Col>
                </Row>
            </Container>
            <Container 
                fluid 
                className="py-3 my-4"
                style={{backgroundColor: "var(--gray-100)"}}
            >
                <Row>
                    <Col>
                        <h5 className="mb-3">Files</h5>
                        <DragDrop handleDrop={addFiles}/>
                        <div className="mt-4">
                            {projectFiles.map((fileRef, i) => (
                                <ProjectFile 
                                    key={i}
                                    fileRef={fileRef} 
                                />
                            ))}
                            {newFiles.map((file, i) => (
                                <FileUpload 
                                    key={i}
                                    file={file} 
                                    destination={projectPath}
                                />
                            ))}
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Link to={`/projects/${projectId}`}>
                    <Button variant="secondary" className="w-100 py-3 mb-3">
                        Save & View
                    </Button>
                </Link>
            </Container>
        </>
    )
}