import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import styles from './ProjectTab.module.css';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../firebase';
import { BsImageAlt } from 'react-icons/bs';
import { GrAddCircle } from 'react-icons/gr';
import { Link, useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { useUsersContext } from "../../contexts/UserContext";
import { LazyLoadImage } from 'react-lazy-load-image-component';


export default function ProjectTab() {

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    const { username } = useParams();
    const { loggedInUser } = useUsersContext();

    useEffect(() => {
        setLoading(true);
        //fetch projects
        const fetchProjects = async () => {
            let q;
            
            if(loggedInUser?.username === username){
                q = query(collection(db, "projects"), where("user", "==", username));
            }else {
                q = query(collection(db, "projects"), where("user", "==", username), where("visibility", "==", "public"));
            }
            
            getDocs(q)
            .then(qSnapshot => {
                const data = [];
                qSnapshot.forEach(doc => {
                    data.push({...doc.data(), id: doc.id });
                });
                setProjects(data);
            })
            .then(() => setLoading(false))
            .catch(e => console.log("something went wrong: ", e.message));
        }
        fetchProjects();
    }, [username]);

    const ProjectList = () => {

        if(loading)
            return <BeatLoader color={"var(--secondary"} className="d-block"/>
        
        if(!projects)
            return <></>

        return (
            <Row className={styles.projectList}>
                {projects.map((project, i) => (
                    <Col key={i} xs={12} lg={4} sm={6} className="my-2">
                        <Link to={project.id}>
                            <div className={styles.projectThumbnail}>
                                {project?.coverUrl &&
                                    <LazyLoadImage 
                                        src={project?.coverUrl} 
                                        placeholder={<BsImageAlt size={50} color="var(--gray-500)"/>}
                                    />  
                                    || <BsImageAlt size={50} color="var(--gray-500)"/>
                                }                                
                            </div>
                        </Link>
                        <p className="text-muted mb-0 mt-1 text-capitalize">{project.title}</p>
                    </Col>
                ))}
            </Row>
        )
    }

    return (
        <div className="p-3" style={{ backgroundColor: "white" }}>
            {loggedInUser?.username === username &&
                <Row>
                    <Col sm={8} xs={12} md={5} lg={4}>
                        <Link to='/new-project'>
                            <Button variant="primary" className="large w-100 px-5 my-3">
                                <GrAddCircle size={22} className="mx-1"/>
                                New project
                            </Button>
                        </Link>
                    </Col>
                </Row>
            }            

            <ProjectList />
        </div>
    )
}