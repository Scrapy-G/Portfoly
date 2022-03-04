import { Button, Container } from 'react-bootstrap';
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
                className="w-100 py-3 my-1"
                onClick={() => handleDownload(fileRef)}
            >
                <FiDownload size={22} style={{ marginLeft: "-30px", marginRight: "10px"}}/>
               {type.toUpperCase()}
            </Button>
        )
    }

    return (
        <div className={styles.filesSection}>
            <Container>
                <h5>Files <span className={styles.fileName}>{name}</span></h5>
                {/* ZIP downloads aren't available as yet */}
                <Button 
                    disabled
                    variant="secondary"
                    className="w-100 py-3 mt-4 mb-1 filled"
                >
                    Download all as ZIP (paid)
                </Button>
                {
                    files.map((file, i) => (
                        <FileDownloadButton 
                            key={i}
                            fileRef={file} 
                        />
                    ))
                }
            </Container>
        </div>
    )
}