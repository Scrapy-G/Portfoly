import { Button, Container } from 'react-bootstrap';
import styles from './FileList.module.css';


export default function FileList ({ files, selected }) {
    return (
        <div className={styles.filesSection}>
            <Container>
                <h5>Files <span className={styles.fileName}>{selected}</span></h5>
                <Button 
                    variant="secondary"
                    className="w-100 py-3 mt-4"
                >
                    Download all as ZIP
                </Button>
            </Container>
        </div>
    )
}