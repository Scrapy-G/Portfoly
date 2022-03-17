import { useEffect, useState } from 'react';
import { Container, Button, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useUsersContext } from '../contexts/UserContext';
import styles from './Profile.module.css';
import ProjectTab from './Project/ProjectTab';
import { db  } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import { BsPerson } from 'react-icons/bs';
import Loader from '../components/Loader';
import { useToastContext } from '../contexts/ToastContext';

export default function Profile() {

  const [currentProfile, setProfile] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const params = useParams();
  const { username } = params;
  const { loggedInUser } = useUsersContext();
  const { showToastMessage } = useToastContext();
  
  useEffect(() => {

    if(username === loggedInUser?.username){
      setProfile(loggedInUser);
    }else {    
      setLoading(true);

      //fetch user info
      const fetchUser = async() => {
        const docRef = doc(db, "users", username);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = await docSnap.data();
          setProfile(data);

        } else {
          //redirect to user not found
          setError("User not found");
        }

        setLoading(false);
      } 
      
      fetchUser();
    }

  }, [username]);

  if(error)
    return <Container><h1 className="mt-5 alert alert-danger">{error}</h1></Container>

  if(loading)
    return <Loader />
  
  if(!currentProfile)
    return <div></div>

  return(
    <div>
      <Container>
        <Row>
          <Col sm={12} lg={3} className="text-center py-5">

            <div className={styles.profileImage}>
              {currentProfile?.photoUrl && 
                <img src={currentProfile?.photoUrl} />
                ||
                <BsPerson size={40} />
              }
            </div>
            <h2 className="font-weight-bold mt-4">
              {currentProfile.name}
            </h2>
            <h5 className="mb-3" style={{ fontSize: "18px" }}>
              {currentProfile?.introduction}
            </h5>

              { currentProfile.id === loggedInUser?.id &&
                <Link to="edit">
                  <Button variant="secondary" className="small stroke my-4">
                    Edit profile
                  </Button>
                </Link>
                ||
                  <Button 
                    variant="primary" 
                    className="small my-4"
                    onClick={() => showToastMessage('failed', 'Feature not available at the moment')}
                  >
                    Contact
                  </Button>
              }
              
          </Col>
          <Col>
            <Tabs defaultActiveKey="projects" className="mt-4">
              <Tab eventKey="projects" title="Projects">
                <ProjectTab />
              </Tab>
              <Tab eventKey="about" title="About" >
                <div className="p-3" style={{ backgroundColor: "white" }}>
                  <p className="my-3 about-text">{currentProfile?.about}</p>
                </div>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>      
    </div>
  );
}
