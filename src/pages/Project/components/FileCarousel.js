import { useEffect, useState } from "react";
import { auth } from '../../../firebase';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import styles from './FileCarousel.module.css';
import { ImageRenderer } from '../../../components/ImageRenderer';

export default function FileCarousel ({ files, selected, onChange = f => f }) {

    // console.log(files);
    function handleChange(e) {
        onChange(e.target.id);
    }

    return (
        <div className={styles.fileCarousel}>
            {Object.keys(files).map((groupName) => (
                <div key={groupName} className={styles.filePreview}>
                    <input 
                        type="radio" 
                        name="file-carousel"
                        checked={selected === groupName}
                        className={styles.radioInput}
                        id={groupName}
                        onChange={handleChange}
                    />
                    <label htmlFor={groupName}>
                        {/* {console.log(files[groupName])}
                        {console.log(files[groupName].thumbnail)} */}
                        <img 
                            src={files[groupName].thumbnail}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </label>
                </div>
            ))}
        </div>
    )
}