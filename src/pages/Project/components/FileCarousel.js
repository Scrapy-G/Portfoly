import { useEffect, useState } from "react";
import { auth } from '../../../firebase';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import styles from './FileCarousel.module.css';
import { ImageRenderer } from '../../../components/ImageRenderer';

export default function FileCarousel ({ files, selected, onChange = f => f }) {

    function handleChange(e) {
        onChange(e.target.id);
    }

    return (
        <div className={styles.fileCarousel}>
            {Object.keys(files).map((groupName, i) => (
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
                        {files[groupName].thumbnail &&
                            <ImageRenderer imgRef={files[groupName].thumbnail} />
                        }
                    </label>
                </div>
            ))}
        </div>
    )
}