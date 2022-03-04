import { useEffect, useState } from 'react';
import { Col, Modal, Button } from 'react-bootstrap';
import { FiCopy } from 'react-icons/fi';
import styles from './ShareModal.module.css';

export default function ShareModal ({ show, onClose, visibility }) {

    const apiKey = process.env.REACT_APP_BITLY_API_KEY;
    const url = window.location.href;

    const [shareLink, setShareLink] = useState("");

    useEffect(() => {

        const dataString = '{ "long_url": "https://dev.bitly.com", "group_guid": "" }';
        fetch("https://api-ssl.bitly.com/v4/shorten", {
            method: 'post',
            headers: {
                'Authorization': `Bearer 381df993b0425b6b1c9b755ac5126bf2b382c017`,
                'Content-Type': 'application/json'
            },
            body: dataString
        })
        .then(res => res.json())
        .then(res => setShareLink(res.link))
        .catch(() => setShareLink(url));
    }, []);

    return (
        <Modal 
            show={show} 
            onHide={onClose}
            className="d-flex justify-content-center align-items-center"
        >
            <Modal.Header closeButton>
                <h2>Share</h2>
            </Modal.Header>

            <Modal.Body className="pb-4">
                
                {visibility == "private" &&
                    <p className="text-danger">
                        Project is private. Make public so 
                        link will work for visitors.
                    </p>
                }

                <p>Copy the link</p>
                <div className={styles.link}>
                    <input 
                        disabled
                        value={shareLink}
                    />
                    <Button variant="primary" className="py-2">
                        <FiCopy size={20} />
                    </Button>
                </div>
            </Modal.Body>

            {/* <Modal.Footer>
                <Button variant="primary" className="px-5 py-2 round">Save changes</Button>
            </Modal.Footer> */}
        </Modal>
    )
}