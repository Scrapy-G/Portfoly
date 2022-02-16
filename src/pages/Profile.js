import { useState } from 'react';
import { Container, Button, Row, Col, Form } from 'react-bootstrap';
import cover from '../assets/cover.png';
import profile from '../assets/profile.png';
import { Radio } from '../components/Radio';
import ProjectList from '../components/ProjectList';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/userSlice';
import { Link } from 'react-router-dom';

export default function Profile() {

  const [ tab, setTab ] = useState("projects");
  const user = useSelector(selectUser);

  const handleRadioChange = (e) => {
    setTab(e.target.value);
  }

  const renderTab = () => {
    if(tab === "projects"){
      return (
        <ProjectList />
      )
    }else if(tab === "about"){
      return (
        <Col>
          <p className="about-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ipsum suspendisse ultrices gravida dictum fusce ut placerat orci. 
            Morbi blandit cursus risus at. Rhoncus urna neque viverra justo nec ultrices. 
            Ultrices tincidunt arcu non sodales neque sodales. Tortor condimentum lacinia 
            quis vel eros donec ac odio tempor. Tellus orci ac auctor augue.
          </p>
        </Col>
      )
    }
  }
  
  return(
    <div>
      <div className="cover-image">
        <img src={cover} />
      </div>
      <Container>
        <div className="profile-image">
          <img src={profile} />
        </div>
        <h5 className="font-weight-bold">John Miller</h5>
        <h3>Creator of breath-taking illustrations</h3>

        <Link to={user ? "/new-project" : "/contact"}>
          <Button variant="primary" className="round my-2 mr-2">
            {user ? "New project" : "Contact" }
          </Button>
        </Link>
        {user &&
          <Link to={user ? "/edit-profile" : "/contact"}>
            <Button variant="primary" className="round mr-2 my-2 stroke">
              {user ? "Edit profile" : "Contact" }
            </Button>
          </Link>         
        }
      
      </Container>
      <div className="action-section py-2 my-4">
        <Container>
          <Radio 
            name="section"
            options={["projects", "about"]}
            onChange={handleRadioChange}
          />
        </Container>
      </div>
      <Container>
        <Row>
          {renderTab()}
        </Row>
      </Container>
      
    </div>
  );
}
