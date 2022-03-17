import { GrClose } from 'react-icons/gr';
import styles from './FileUpload.module.css'
import { getStorage, ref, uploadBytesResumable, getMetadata, deleteObject } from 'firebase/storage';
import { auth } from '../../firebase';
import { useEffect, useState } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';

export const FileUpload = ({ file, destination, onComplete }) => {

    // console.log(file);
    const [uploadTask, setUploadTask] = useState();
    const [progress, setProgress] = useState(0);
    const [deleted, setDeleted] = useState(false);
    const [error, setError] = useState();

    const storage = getStorage();
    const fileRef = ref(storage, destination + file.name);
    useEffect(() => {
        const upload = uploadBytesResumable(fileRef, file);
        upload.on('state_changed', snapshot => {
            const prog = snapshot.bytesTransferred / snapshot.totalBytes * 100;
            setProgress(prog)
            if(prog === 100){
                onComplete(fileRef);
            }
        },
        error => {
            setError(error.message);
        },
        () => { //success
            setProgress(100)
        });

        setUploadTask(upload);

    }, [file, destination]);

    if(deleted)
        return <></>

    const cancelUpload = () => {
        if(progress !== 100)
            uploadTask.cancel();
        else {
            deleteObject(fileRef)
        }

        setDeleted(true);
    }

    if(deleted) return <></>

    return (
        <div className={styles.fileUpload}>
            <div className={styles.info}>
                <div className="w-100 d-flex justify-content-between">
                    <span
                        style={{ whiteSpace: 'nowrap', overflow: "hidden", textOverflow: "ellipsis", maxWidth: "70%"}}
                    >
                        {file.name}
                    </span>
                    <span className={styles.fileSize}>
                        {renderFileSize(file.size)}
                    </span>
                    
                </div> 
                {error && 
                    <div className="small text-danger">Something went wrong.</div>
                    || 
                    <div className={styles.progressBar}>
                        <div className={styles.fill} style={{ width: `${progress}%` }}></div>
                    </div>
                }                
                
            </div>
            
            <IoMdCloseCircle 
                style={{ cursor: "pointer" }}
                size={24} 
                color="var(--gray-400)"
                onClick={cancelUpload}
            />
        </div>
    )
}

export const ProjectFile = ({ fileRef, onDelete = f => f }) => {

    const [fileSize, setFileSize] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMetadata(fileRef)
            .then(res => {
                setFileSize(res.size);
                setLoading(false);
            })
    }, [fileRef])

    const handleDelete = () => {
        onDelete(fileRef);       
    }

    if(loading)
        return renderLoadingFallBack();

    return (
        <div className={styles.fileUpload}>
            <div className={styles.info}>
                <div
                    style={{ whiteSpace: 'nowrap', overflow: "hidden", textOverflow: "ellipsis", maxWidth: "80%"}}
                >
                    {fileRef.name}
                </div>
                <div className={styles.fileSize}>
                    {renderFileSize(fileSize)}
                </div>
            </div>
            
            <IoMdCloseCircle 
                style={{ cursor: "pointer" }}
                size={24} 
                color="var(--gray-400)"
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