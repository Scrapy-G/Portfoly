import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";
import styles from './Project.module.css';
import { FiDownload, FiShare2 } from 'react-icons/fi'
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoMdArrowRoundBack } from 'react-icons/ai'
import { BsThreeDotsVertical, BsImageAlt } from 'react-icons/bs';
import { BiArrowBack } from 'react-icons/bi';
import { useEffect, useReducer, useState } from "react";
import { Navigate, useNavigate, useParams, Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { auth, db, storage } from '../../firebase';
import { listAll, ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import FileCarousel from "./components/FileCarousel";
import { ImageRenderer } from "../../components/ImageRenderer";
import FileList from "./components/FileList";
import ShareModal from "./components/ShareModal";
import { useToastContext } from "../../contexts/ToastContext";
import { useUsersContext } from "../../contexts/UserContext";
// import Toast from 'react-native-toast-message';

export default function Project () {

    const [project, setProject] = useState();
    const [files, setFiles] = useState();
    const [selectedFile, setSelectedFile] = useState();
    const [showModal, setShowModal] = useReducer(old => !old, false);
    
    const [loading, setLoading] = useState(true);

    const params = useParams();
    const navigate = useNavigate();

    const { projectId, username } = params;
    const { showToastMessage } = useToastContext();
    const { loggedInUser } = useUsersContext();

    const projectPath = `/users/${username}/projects/${projectId}`;

    useEffect(() => {

        const docRef = doc(db, "projects", projectId);

        const fetchProject = async () => {
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setProject(docSnap.data());
                
                const listRef = ref(storage, projectPath);
                const fileRefs = await listAll(listRef)
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
                            const url = await getDownloadURL(fileRef);
                            files[group].thumbnail = url;
                            break;
                    }
                }
                
                setFiles(files);
                setSelectedFile(Object.keys(files)[0]);
                resolve();
            });
        }

        fetchProject()
        .catch(e => {
            //show toast message
        });

    }, []);

    if(loading)
        return <Loader/>

    function deleteProject() {
        setLoading(true);

        //delete all project files
        for(let key in files){
            files[key].files.forEach(fileRef => {
                deleteObject(fileRef);                
            })
        }

        //delete document
        const docRef = doc(db, "projects", projectId);
        deleteDoc(docRef)
        .then(() => {
            showToastMessage('success', 'Project deleted successfully!');
            navigate(`/${username}`);
        })
        .catch(() => {
            showToastMessage('error', 'Error occurred. Try again later!');
            navigate(`/${username}`);
        })
        
    }

    return (
        <>
            <Container>
                <Link to={`/${username}`} className="mt-2 d-block text-decoration-none small">
                    <BiArrowBack size={20}/>
                    {username}
                </Link>
                <Row className="mt-4 mb-4">
                    <Col>                        
                        <h1>{project.title}</h1>
                        <div className={styles.actions}>
                            <button onClick={setShowModal}>
                                <FiShare2 size={25} color="var(--secondary)"/>
                            </button>

                            {loggedInUser &&
                                <Dropdown>
                                    <Dropdown.Toggle variant="none">
                                        <BsThreeDotsVertical size={30} color="var(--gray-600)"/>
                                    </Dropdown.Toggle>
                                    
                                    <Dropdown.Menu>
                                        <Link to='upload' className="dropdown-item">
                                            Manage files
                                        </Link>
                                        <Dropdown.Divider/>
                                        <Link to={`/new-project/${projectId}`} className="dropdown-item">
                                            Edit project
                                        </Link>
                                        <Dropdown.Divider/>
                                        <Dropdown.Item onClick={deleteProject} className="dropdown-item danger">
                                            Delete
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            }                            
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} md={6}>
                        {files && 
                            <>
                                <div className={styles.preview}>
                                    {files[selectedFile].thumbnail &&
                                        <img 
                                            src={files[selectedFile].thumbnail}
                                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                        />
                                        ||
                                        <BsImageAlt size={50} color="var(--gray-500)"/>
                                    }
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
                                <BsImageAlt size={50} color="var(--gray-500)"/>
                                <p className="text-muted my-3">No files here at the moment</p>
                                <Link to='upload'>
                                    <Button
                                        variant="secondary"
                                        className="small"
                                        style={{ maxWidth: "150px" }}
                                    >
                                        Add files
                                    </Button>
                                </Link>
                            </div>
                        }
                        
                    </Col>
                    {files && 
                        <Col sm={12} md={6} lg={4}>
                            <FileList name={selectedFile} files={files[selectedFile].files} />
                        </Col>
                    } 
                </Row>
                           
                <ShareModal show={showModal} onClose={setShowModal} visibility={project.visibility}/>
            </Container>
        </>
    )
}