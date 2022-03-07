import { useEffect, useState } from 'react';
import { Container, Button, Row, Col, Tabs, Tab } from 'react-bootstrap';
import profile from '../assets/profile.png';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { useUsersContext } from '../contexts/UserContext';
import styles from './Profile.module.css';
import ProjectTab from './Project/ProjectTab';
import { db  } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import { BsPerson } from 'react-icons/bs';
import Loader from '../components/Loader';

export default function Profile() {

  const [currentProfile, setProfile] = useState();
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const { username } = params;
  const { loggedInUser } = useUsersContext();
  
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
          console.log("user not found");
        }

        setLoading(false);
      } 
      
      fetchUser();
    }

  }, [username]);

  console.log(currentProfile);

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
                <Link to="contact">
                  <Button variant="primary" className="small my-4">
                    Contact
                  </Button>
                </Link>
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
