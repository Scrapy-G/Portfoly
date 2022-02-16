import styles from './Radio.module.css';

export const Radio = ({ name, onChange = f => f,  options = [], ...rest }) => {

    return (
        <div>
           { options.map((option, i) => (
                <div key={i} className={styles.radioGroup}>
                    <input 
                        id={name + "-" + i}
                        type="radio" 
                        name={name}
                        value={option}
                        defaultChecked={i === 0}
                        className={styles.radioInput}
                        onChange={onChange}
                    />
                    <label
                        htmlFor={name + "-" + i}
                        {...rest}
                    >
                        {option}
                    </label>
                </div>
           ))}
        </div>
    )
}