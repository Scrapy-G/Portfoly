import { useEffect, useState } from 'react';
import { Col, Modal, Button } from 'react-bootstrap';
import { FiCopy } from 'react-icons/fi';
import styles from './ShareModal.module.css';

export default function ShareModal ({ show, onClose, visibility }) {

    const url = window.location.href;

    const [copied, setCopied] = useState(false);

    function copyUrl() {
        navigator.clipboard.writeText(url);
        setCopied(true);
    }

    return (
        <Modal 
            show={show} 
            onHide={() => {
                setCopied(false);
                onClose();
            }}
            className="d-flex justify-content-center align-items-center p-3"
        >
            <Modal.Header closeButton className="px-4">
                <h2>Share</h2>
            </Modal.Header>

            <Modal.Body className="p-4">
                
                {visibility == "private" &&
                    <p className="text-danger">
                        Project is private. Make public so 
                        link will work for visitors.
                    </p>
                }
                {copied && 
                    <p className="text-success">Copied!</p>
                ||
                    <p>Copy the link</p>
                }                
                <div className={styles.link}>
                    <input 
                        readOnly
                        value={url}
                    />
                    <Button variant="primary" className="py-2" onClick={copyUrl}>
                        <FiCopy size={20} />
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}