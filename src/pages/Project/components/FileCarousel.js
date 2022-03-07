import { BsImageAlt } from 'react-icons/bs';
import styles from './FileCarousel.module.css';

export default function FileCarousel ({ files, selected, onChange = f => f }) {

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
                        {files[groupName].thumbnail &&
                            <img 
                                src={files[groupName].thumbnail}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            ||
                            <BsImageAlt size={50} color="var(--gray-500)"/>
                        }                        
                    </label>
                </div>
            ))}
        </div>
    )
}