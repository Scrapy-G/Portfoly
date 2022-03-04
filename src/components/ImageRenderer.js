import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";

export const ImageRenderer = ({ 
    src, 
    height = "100%", 
    width = "100%", 
    objectFit = "cover" 
}) => {
    
    return (
        <img 
            src={src}
            style={{ width: width, height: height, objectFit: objectFit }}
        />
    );
  };
