import { Container, Button, Row, Col, Dropdown, Form } from "react-bootstrap";
import DragDrop from '../components/File/DragDrop';
import { FileUpload, ProjectFile } from "../components/File/FileUpload";
import { useEffect, useState, useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import { auth } from '../firebase';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import Header from '../components/Header';
import { useUsersContext } from "../contexts/UserContext";
import { doc, getDoc, getDocs, limit, query, setDoc, where } from "firebase/firestore";
import { db } from '../firebase';

export default function ManageFiles () {

    const [newFiles, addFiles ] = useReducer((oldFiles, newFile) =>[...oldFiles, ...newFile], []);
    const [projectFiles, setProjectFiles] = useState([]);
    const { loggedInUser } = useUsersContext();

    const params = useParams();
    const storage = getStorage();
    const projectId = params.projectId;
    const projectPath = loggedInUser.username + "/" + projectId + "/";

    useEffect(() => {
        const listRef = ref(storage, projectPath);
        listAll(listRef)
            .then(res => {
                setProjectFiles(res.items);
            })
    }, [projectId]);

    const CoverImageSelect = () => {

        //TODO: read current cover from project
        //and set as default selected 

        const projectRef = doc(db, 'projects', projectId);
        const ext = ["jpg", "jpeg", "png"];

        const images = projectFiles.filter((file) => {            
            let type = file.name.split(".")[1];
            return ext.includes(type);
        });

        async function setCover(imageFile) {
            const imgUrl = await getDownloadURL(imageFile);
            setDoc(projectRef, {coverUrl: imgUrl}, { merge: true });
        }

        function handleChange(e) {            
            if(e.target.value === "") 
                return;

            const newCover = images[e.target.value];
            setCover(newCover);
        }

        return (
            <div className="mb-4">
                <p className="text-muted mb-1">
                    Change cover image
                </p>
                <Form.Select onChange={handleChange} className="p-3">
                    <option selected value="">Select image</option>
                    {images.map((file, i) => (
                        <option key={i} value={i}>{file.name}</option>
                    ))}
                </Form.Select>
            </div>
        );
    }

    return (
        <>
            <Container>
                <h1 className="my-5">Manage files</h1>
                <Row>
                    <Col xs={12} md={6} className="mb-5">                        
                        <DragDrop handleDrop={addFiles}/>
                    </Col>
                    <Col sm={12} md={5}>
                        <CoverImageSelect />

                        <div className="mt-4">
                            <p className="text-muted mb-1">
                                Files
                            </p>
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

                        <Link to={`/${loggedInUser.username}/${projectId}`}>
                            <Button variant="primary" className="w-100 large">
                                Save & View
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </>
    )
}