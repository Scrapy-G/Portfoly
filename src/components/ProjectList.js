import { Radio } from '../components/Radio';
import { Container, Row, Col, Form } from 'react-bootstrap';
import styles from './ProjectList.module.css';
import { Link } from 'react-router-dom';

export default function ProjectList () {

  const Project = ({ id, image, title }) => {
    return (
      <Col xs={12} sm={6} md={4} lg={4} className={styles.project}>
        <Link to='/'>
          <div className={styles.imgContainer}>
            <image src={image} />
          </div>
        </Link>
        <p className="font-weight-light mt-2">{title}</p>
      </Col>
    )
  }
    return (  
      <Container>
        <Row className="mb-5">
          <Col>
            <Form className={styles.searchForm}>
              <Form.Control 
                type="text"
                placeholder="Search"
                name="search"
                className="px-0 mb-3"
              />

              <Form.Group className="my-2">
                <Form.Label className="mb-0" >Sort by:</Form.Label>
                <Radio
                  name="sortBy"
                  options={["name", "date"]}
                  className="small"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="mb-0">Filter</Form.Label>
                <Radio
                  name="filter"
                  className="small"
                  options={["all", "private", "public"]}
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Project 
            title="Project title"
          />
          <Project 
            title="Project title 2"
          />
        </Row>
      </Container>
    )
}