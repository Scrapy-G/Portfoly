import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Radio } from "../../components/Radio";
import styles from './ProjectTab.module.css';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../firebase';
import { BsImageAlt } from 'react-icons/bs';
import { RiSearch2Line } from 'react-icons/ri';
import { Link } from "react-router-dom";


export default function ProjectTab({ userId }) {

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        //fetch projects
        const fetchProjects = async () => {
            const q = query(collection(db, "projects"), where("user", "==", userId));
            
            getDocs(q)
            .then(qSnapshot => {
                const data = [];
                qSnapshot.forEach(doc => {
                    data.push(doc.data());
                });
                setProjects(data);
            })
            .then(() => setLoading(false))
            .catch(e => console.log("something went wrong: ", e.message));
        }
        fetchProjects();
    }, [userId]);

    const handleSearch = (e) => {
        
        console.log("searching");
    }

    const ProjectList = () => {

        if(loading)
            return <p>loading...</p>
        
        if(!projects)
            return <></>
        
        return (
            <Row className={styles.projectList}>
                {projects.map((project, i) => (
                    <Col key={i} xs={12} md={4} className="my-2">
                        <Link to={project.title}>
                            <div className={styles.projectThumbnail}>
                                <BsImageAlt size={50} color="var(--gray-500)"/>
                            </div>
                        </Link>
                        <p className={styles.projectTitle}>{project.title}</p>
                    </Col>
                ))}
            </Row>
        )
    }

    return (
        <div className="p-3" style={{ backgroundColor: "white" }}>
            <Button variant="primary" className="large px-5 my-3">
                New project
            </Button>

            <form className={styles.searchForm} onSubmit={handleSearch}>
                <input 
                    name="search"
                    className={styles.searchInput}
                    placeholder="Search"
                />
                <button type="submit">
                    <RiSearch2Line size={20} color="var(--secondary)"/>
                </button>                
            </form>

            <div className="mt-3 mb-2">
                <p className="text-muted mb-1">Sort by:</p>
                <Radio 
                    name="sort-by"
                    options={["name", "date"]}
                />
            </div>
            <div className="mb-3">
                <p className="text-muted mb-1">View:</p>
                <Radio 
                    name="view-by"
                    options={["all", "private", "public"]}
                />
            </div>

            <ProjectList />
        </div>
    )
}