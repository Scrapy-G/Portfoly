import { createContext, useState, useEffect, useContext } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, addDoc, collection, db,  authStateChanged  } from '../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";


export const UserContext = createContext();
export const useUsersContext = () => useContext(UserContext);

export default function UserProvider({ children }) {

    const [loggedInUser, loginUser] = useState();
    const [status, setStatus] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        //check if user already signed in
        setLoading(true);
        setStatus('initial');
        authStateChanged(auth, (user) => {
          if (user) {
            loginUser(user);
          } 
          setLoading(false);
          setStatus('idle');
  
        });
    }, [auth]);

    const signInWithEmail = async({ email, password }) => {
        setLoading(true);

        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            //TODO
            loginUser({ 
                id: auth.currentUser.uid,
                username: "ADD USERNAME"
            });
        })
        .then(() => setLoading(false))
        .catch(e => {
            setLoading(false);
            setError(e.message);
        });
    }

    const createUserWithEmail = async ({ username, name, email, password }) => {

        setLoading(true);

        //check if username is already taken
        const docRef = doc(db, "users", username);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            setError("Username is taken");
            setLoading(false);
        }else {
            //create new user
            createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                return setDoc(doc(db, 'users', username), {
                    id: auth.currentUser.uid,
                    name
                })
            })
            .then(() => loginUser({username, id: auth.currentUser.uid}))
            .then(() => setLoading(false))
            .catch(e => {
                setLoading(false);
                setError(e.message);
            });
        }
    }

    return (
        <UserContext.Provider value={{ user: loggedInUser, error, loading, createUserWithEmail, signInWithEmail }}>
          {children}
        </UserContext.Provider>
    );
}