import { Container, Row, Col } from "react-bootstrap";
import styles from './Project.module.css';
import { FiDownload, FiShare2 } from 'react-icons/fi'
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiOutlineEdit } from 'react-icons/ai'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { auth, db, storage } from '../../firebase';
import { listAll, ref, getDownloadURL } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';
import FileCarousel from "./components/FileCarousel";
import { ImageRenderer } from "../../components/ImageRenderer";
import FileList from "./components/FileList";

export default function Project () {

    const [project, setProject] = useState();
    const [files, setFiles] = useState();
    const [selectedFile, setSelectedFile] = useState();
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    const params = useParams();
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
                parseFiles(fileRefs.items);
            }

            setLoading(false);
        }

        const parseFiles = async (fileRefs) => {
            const files = {};    
            fileRefs.forEach((fileRef, i) => {
                const [group, fileType] = fileRef.name.split(".");
    
                if(files[group]){
                    files[group].files.push(fileRef)
                }else {
                    files[group] = {
                        files: [fileRef]
                    }
                }
    
                if(i == 0)
                    setSelectedFile(group);
    
                switch(fileType){
                    case 'jpeg':
                    case 'png':
                    case 'jpg':
                        files[group].thumbnail = fileRef;
                        break;
                }
            });
    
            setFiles(files);
        }

        fetchProject()
        .catch(e => setError(e.message));

    }, []);

    // console.log(files);
    //create carousel componenet to parse files nad put in array for groups

    if(loading)
        return <Loader/>

    const handleChange = (e) => {

    }

    return (
        <>
            <Container>
                <Row className="mb-5">
                    <Col>
                        <h1 className="my-4">{project.title}</h1>
                        <div className={styles.actions}>
                            <button className="btn-dark">
                                <FiDownload size={20} color="white"/>
                            </button>
                            <button>
                                <FiShare2 size={20}/>
                            </button>
                            <button>
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
                        <div className={styles.preview}>
                            <ImageRenderer 
                                imgRef={files[selectedFile].thumbnail} 
                                height="300px"
                                objectFit="contain"
                            />
                            {/* <h5>No files here at the moment</h5>
                            <Link to='upload'>
                                <Button
                                    variant="secondary"
                                    className="round"
                                    style={{ maxWidth: "150px" }}
                                >
                                    Add files
                                </Button>
                            </Link> */}
                        </div>
                        <FileCarousel 
                            files={files}
                            selected={selectedFile}
                            projectId={projectId}
                            onChange={(file) => setSelectedFile(file)}
                        />
                    </Col>
                </Row>
            </Container>
            <FileList files={files} selected={selectedFile} />
        </>
    )
}