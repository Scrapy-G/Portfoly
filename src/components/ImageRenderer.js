import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";

export const ImageRenderer = ({ 
    imgRef, 
    height = "100%", 
    width = "100%", 
    objectFit = "cover" 
}) => {

    const [imageUrl, setUrl] = useState("");
    const storage = getStorage();

    useEffect(() => {
        getDownloadURL(imgRef).then(url => {
            setUrl(url);
        })
    })
    
    return (
        <img 
            src={imageUrl}
            style={{ width: width, height: height, objectFit: objectFit }}
        />
    );
  };
