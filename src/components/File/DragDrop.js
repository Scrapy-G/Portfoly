import { getStorage, ref } from 'firebase/storage';
import { useRef, useReducer } from 'react';
import { BsUpload } from 'react-icons/bs';
import styles from './FileUpload.module.css';

export default function DragDrop ({ handleDrop = f => f }) {

    const dropzone = useRef();
    const inpFile = useRef();
    
    const handleChange = (e) => {        
        handleDrop([...e.target.files])
    }

    const onDragOver = (e) => {
        e.stopPropagation();
        console.log("enter");
        dropzone.current.classList.add("active");
        console.log(dropzone.current.classList);
    }

    const onDragLeave = (e) => {
        e.stopPropagation();
        console.log("leave");
        dropzone.current.classList.remove("active");
    }

    const onDrop = (e) => {
        e.preventDefault();
        dropzone.current.classList.remove("active");

        handleDrop([...e.dataTransfer.files]);
    }

    const handleClick = (e) => {
        inpFile.current.click();
    }

    return (
        <>
        <div 
            className={styles.dragdrop}
            ref={dropzone} 
            onClick={handleClick}
            onDragEnter={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
        >           
            <div className='content text-center p-5' style={{pointerEvents: 'none'}} >
                <h5>Drop files here or click to upload</h5>
                <BsUpload size={30}/>
                <input 
                    ref={inpFile} 
                    id='select-file' 
                    type='file' 
                    multiple 
                    style={{display: 'none'}} 
                    onChange={handleChange}
                ></input>                 
            </div>
        </div>
        
          {/* <div className='uploaded-files'>
              <ul>
                  {files.map((file, i) => {
                      return <li key={i}>"File"</li>
                  })}
              </ul>
          </div> */}
        </>
    )
}