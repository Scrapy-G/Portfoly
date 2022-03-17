import { Container, Button, Row, Col, Form } from "react-bootstrap";
import DragDrop from '../components/File/DragDrop';
import { FileUpload, ProjectFile } from "../components/File/FileUpload";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getStorage, ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { useUsersContext } from "../contexts/UserContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from '../firebase';

export default function ManageFiles () {

    const [uploadFiles, setUploadFiles ] = useState([]);
    const [projectFiles, setProjectFiles] = useState([]);
    const { loggedInUser } = useUsersContext();

    const params = useParams();
    const storage = getStorage();
    const projectId = params.projectId;
    const projectPath = `/users/${loggedInUser.username}/projects/${projectId}/`;

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

        //TODO: add newFiles to project Files after upload

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

        function handleCoverChange(e) {            
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
                <Form.Select onChange={handleCoverChange} className="p-3">
                    <option value="">Select image</option>
                    {images.map((file, i) => (
                        <option key={i} value={i}>{file.name}</option>
                    ))}
                </Form.Select>
            </div>
        );
    }

    function onFileUploadComplete(fileRef) {
        setProjectFiles([...projectFiles, fileRef]);
        // //remove file from upload
        setUploadFiles(uploadFiles.filter(item => (
            item.name !== fileRef.name
        )));      
    }
    
    function deleteFile(fileRef) {
        deleteObject(fileRef);
        setProjectFiles(projectFiles.filter(item => (
            item.name !== fileRef.name
        )));
    }

    return (
        <>
            <Container>
                <h1 className="my-5">Manage files</h1>
                <Row className="pb-5">
                    <Col xs={12} md={6} className="mb-5">                        
                        <DragDrop handleDrop={file => {
                            setUploadFiles([...uploadFiles, ...file])
                        }}/>
                    </Col>
                    <Col sm={12} md={5}>
                        <CoverImageSelect />

                        <div className="my-4">
                            <p className="text-muted mb-1">
                                Files
                            </p>
                            {projectFiles.map((fileRef, i) => (
                                <ProjectFile 
                                    key={i}
                                    fileRef={fileRef} 
                                    onDelete={deleteFile}
                                />
                            ))}
                            {uploadFiles.map((file, i) => (
                                <FileUpload 
                                    key={i}
                                    index={i}
                                    file={file} 
                                    destination={projectPath}
                                    onComplete={(fileRef) => onFileUploadComplete(fileRef)}
                                />
                            ))}
                        </div>

                        <Link to={`/${loggedInUser.username}/${projectId}`}>
                            <Button variant="primary" className="w-100 large">
                                View project
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </>
    )
}