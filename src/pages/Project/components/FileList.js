import { Button, Col, Container, Row } from 'react-bootstrap';
import { ProjectFile } from "../../../components/File/FileUpload";
import { getDownloadURL } from "firebase/storage";
import { storage } from '../../../firebase';
import { FiDownload } from 'react-icons/fi';
import styles from './FileList.module.css';


export default function FileList ({ files, name }) {

    const handleDownload = (fileRef) => {
        getDownloadURL(fileRef)
        .then(url => {
            window.open(url);
        })
    }

    const FileDownloadButton = ({ fileRef }) => {
        const type = fileRef.name.split(".")[1];
        return (
            <Button 
                variant="secondary"
                className="w-100 stroke large my-1"
                onClick={() => handleDownload(fileRef)}
            >
                <FiDownload size={22} style={{ marginLeft: "-30px", marginRight: "10px"}}/>
               {type.toUpperCase()}
            </Button>
        )
    }

    return (
        <Container style={{ backgroundColor: "white" }}>
            <Row className="py-4">
                <Col>
                    <h5 className="d-flex mb-4">
                        Files 
                        <p
                            className="font-weight-bold text-capitalize mx-2 my-0" 
                            style={{ color: "var(--gray-400)" }}
                        >
                            {name}
                        </p>
                    </h5>
                    {
                        files.map((file, i) => (
                            <FileDownloadButton 
                                key={i}
                                fileRef={file} 
                            />
                        ))
                    }
                </Col>
            </Row>
        </Container>
    )
}