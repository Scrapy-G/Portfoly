import { Container, Row, Col, Button } from "react-bootstrap";
import styles from './Project.module.css';
import { FiDownload, FiShare2 } from 'react-icons/fi'
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiOutlineEdit } from 'react-icons/ai'
import { useEffect, useReducer, useState } from "react";
import { Navigate, useNavigate, useParams, Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { auth, db, storage } from '../../firebase';
import { listAll, ref, getDownloadURL } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';
import FileCarousel from "./components/FileCarousel";
import { ImageRenderer } from "../../components/ImageRenderer";
import FileList from "./components/FileList";
import ShareModal from "./components/ShareModal";

export default function Project () {

    const [project, setProject] = useState();
    const [files, setFiles] = useState();
    const [selectedFile, setSelectedFile] = useState();
    const [showModal, setShowModal] = useReducer(old => !old, false);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    const params = useParams();
    const navigate = useNavigate();

    const projectId = params.projectId;
    const projectPath = auth.currentUser.uid + "/" + projectId + "/";

    useEffect(() => {

        const docRef = doc(db, "projects", projectId);

        const fetchProject = async () => {
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setProject(docSnap.data());
                
                const listRef = ref(storage, projectPath);
                const fileRefs = await listAll(listRef)
                console.log(fileRefs)
                await parseFiles(fileRefs.items);
            }

            setLoading(false);
        }

        const parseFiles = (fileRefs) => {
            if(fileRefs.length == 0) return

            return new Promise(async(resolve) => {
                const files = {};    
                for(const fileRef of fileRefs) {
                    const [group, fileType] = fileRef.name.split(".");
        
                    if(files[group]){
                        files[group].files.push(fileRef)
                    }else {
                        files[group] = {
                            files: [fileRef]
                        }
                    }
        
                    switch(fileType){
                        case 'jpeg':
                        case 'png':
                        case 'jpg':
                            const url =  await getDownloadURL(fileRef);
                            files[group].thumbnail = url;
                            console.log("gotten thumb")
                            break;
                    }
                }
                
                setFiles(files);
                setSelectedFile(Object.keys(files)[0]);
                resolve();
            });
        }

        fetchProject()
        .catch(e => setError(e.message));

    }, []);

    if(loading)
        return <Loader/>

    return (
        <div>
            <Container>
                <Row className="mb-5">
                    <Col>
                        <h1 className="my-4">{project.title}</h1>
                        <div className={styles.actions}>
                            <Button variant="primary" className="p-0" disabled>
                                <FiDownload size={20} color="black"/>
                            </Button>
                            <button onClick={setShowModal}>
                                <FiShare2 size={20}/>
                            </button>
                            <button onClick={() => navigate(`/new-project/${projectId}`)}>
                                <AiOutlineEdit size={25}/>
                            </button>
                            <button className="btn-danger">
                                <RiDeleteBin6Line size={20}/>
                            </button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {files && 
                            <>
                                <div className={styles.preview}>
                                    <ImageRenderer 
                                        src={files[selectedFile].thumbnail} 
                                        height="300px"
                                        objectFit="contain"
                                    />
                                </div>
                                <FileCarousel 
                                    files={files}
                                    selected={selectedFile}
                                    projectId={projectId}
                                    onChange={(file) => setSelectedFile(file)}
                                />
                            </>
                        ||
                            <div className={styles.preview}>
                                <h5>No files here at the moment</h5>
                                <Link to='upload'>
                                    <Button
                                        variant="secondary"
                                        className="round"
                                        style={{ maxWidth: "150px" }}
                                    >
                                        Add files
                                    </Button>
                                </Link>
                            </div>
                        }
                        
                    </Col>
                </Row>
            </Container>
            {files && 
                <FileList name={selectedFile} files={files[selectedFile].files} />
            }        
            <ShareModal show={showModal} onClose={setShowModal} visibility={project.visibility}/>
        </div>
    )
}