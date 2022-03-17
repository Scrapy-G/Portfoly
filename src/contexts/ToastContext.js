import { createContext, useContext, useState } from "react";

export const ToastContext = createContext();
export const useToastContext= () => useContext(ToastContext);

export default function ToastProvider({ children }) {

    const [toast, setToast] = useState();
    const [show, setShow] = useState(false);

    function showToastMessage(type, text){
        setToast({ type, text });
        setShow(true);
        setTimeout(() => {
            setShow(false);
        }, 3000);
    }

    return <ToastContext.Provider value={{ show, toast, showToastMessage }}>
        {children}
    </ToastContext.Provider>
}