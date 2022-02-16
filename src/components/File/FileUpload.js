import { GrClose } from 'react-icons/gr';
import styles from './FileUpload.module.css'
import { getStorage, ref, uploadBytesResumable, getMetadata, deleteObject } from 'firebase/storage';
import { auth } from '../../firebase';
import { useEffect, useState } from 'react';

export const FileUpload = ({ file, destination }) => {

    // console.log(file);

    const [progress, setProgress] = useState(0);
    const [error, setError] = useState();
    const [deleted, setDeleted] = useState(false);

    const storage = getStorage();
    const fileRef = ref(storage, destination + file.name);

    let uploadTask;

    useEffect(() => {
        uploadTask = uploadBytesResumable(fileRef, file);
        uploadTask.on('state_changed', snapshot => {
            console.log("running");
            const prog = snapshot.bytesTransferred / snapshot.totalBytes * 100;
            setProgress(prog)
        },
        error => {
            console.log(error.message);
        },
        () => { //success
            console.log("upload completed");
            setProgress(100)
        });

    }, [file, destination]);

    const cancelUpload = () => {
        if(progress != 100)
            uploadTask.cancel();
        else {
            deleteObject(fileRef).then(() => {
                setDeleted(true);
            })
        }
    }

    if(deleted) return <></>

    return (
        <div className={styles.fileUpload}>
            <div
                style={{ whiteSpace: 'nowrap', overflow: "hidden", textOverflow: "ellipsis", maxWidth: "50%"}}
            >
                {file.name}
            </div>
            <div className={styles.fileSize}>
                {renderFileSize(file.size)}
            </div>
            <GrClose 
                style={{ cursor: "pointer" }}
                size={20} 
                onClick={cancelUpload}
            />
            <div 
                className={styles.progressBar} 
                style={{ width: `${progress}%`, backgroundColor: progress == 100 ? "var(--primary-dark)" : "var(--gray-700)"}}
            ></div>
        </div>
    )
}

export const ProjectFile = ({ fileRef, onDelete = f => f }) => {

    // console.log(fileRef);

    const [fileName, setFileName] = useState();
    const [fileSize, setFileSize] = useState();
    const [loading, setLoading] = useState(true);
    const [deleted, setDeleted] = useState(false);

    useEffect(() => {
        getMetadata(fileRef)
            .then(res => {
                setFileName(res.name);
                setFileSize(res.size);
                setLoading(false);
            })
    }, [fileRef])

    const handleDelete = () => {
        deleteObject(fileRef).then(() => {
            setDeleted(true);
        })
    }

    if(loading)
        return renderLoadingFallBack();

    if(deleted) return <></>

    return (
        <div className={styles.fileUpload}>
            <div
                style={{ whiteSpace: 'nowrap', overflow: "hidden", textOverflow: "ellipsis", maxWidth: "50%"}}
            >
                {fileName}
            </div>
            <div className={styles.fileSize}>
                {renderFileSize(fileSize)}
            </div>
            <GrClose 
                style={{ cursor: "pointer" }}
                size={20} 
                onClick={handleDelete}
            />
        </div>
    )
}

function renderLoadingFallBack() {
    return (
        <div className={styles.fileLoading}></div>
    )
}

function renderFileSize(size) {
    const kb = size / 1024;

    if(kb < 1){
        return Math.floor(size) + "B";
    }else if(kb >= 1000){
        return (kb / 1024).toFixed(1) + "MB";
    }

    return Math.floor(kb) + "KB";
}