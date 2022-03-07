import { createContext, useState, useEffect, useContext } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, addDoc, collection, db,  authStateChanged, storage  } from '../firebase';
import { doc, getDoc, getDocs, limit, query, setDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";


export const UserContext = createContext();
export const useUsersContext = () => useContext(UserContext);

export default function UserProvider({ children }) {

    const [loggedInUser, setUser] = useState();
    const [status, setStatus] = useState('initializing');
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        
        setLoading(true);
        
        authStateChanged(auth, (user) => {
          if (user) {
            fetchUser(user.uid)
            .then(setUser)
            .then(() => setLoading(false))
            .then(() => setStatus('idle'));
          }else {
            setLoading(false);
            setStatus('idle');  
          }
        });
        
    }, [auth]);

    const signInWithEmail = ({ email, password }) => {
        setLoading(true);

        signInWithEmailAndPassword(auth, email, password)
        .then(() => fetchUser(auth.currentUser.uid))
        .then(setUser)
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
            .then(() => setUser({username, id: auth.currentUser.uid}))
            .then(() => setLoading(false))
            .catch(e => {
                setLoading(false);
                setError(e.message);
            });
        }
    }

    function fetchUser (id) {
        return new Promise((resolve) => {
            const q = query(collection(db, "users"), where("id", "==", id), limit(1));
            getDocs(q)
            .then(snapshot => {
                let user;
                snapshot.forEach(doc => {
                    user = {
                        photoUrl: auth.currentUser.photoUrl,
                        username: doc.id,
                        ...doc.data()
                    }
                });
                resolve(user);
            });
        });        
    }

    function updateUser({ name, about, introduction }) {
        return new Promise(resolve => {
            setLoading(true);

            const data = { name, about, introduction };
            const userRef = doc(db, 'users', loggedInUser.username);
            
            setDoc(userRef, data, { merge: true })
            .then(() => {
                setUser( {
                    ...loggedInUser,
                    ...data
                })
            })
            .then(() => setLoading(false))
            .then(resolve)
        });
    }

    function updateProfileImage (img) {
        return new Promise(async (resolve) => {
            //TODO: do some validation here

            const imageType = img.type.split("/")[1];
            const profileImgRef = ref(storage, `${loggedInUser.username}/profile.${imageType}`);
            
            const snapshot = await uploadBytes(profileImgRef, img);
            const url = await getDownloadURL(snapshot.ref);

            const userRef = doc(db, 'users', loggedInUser.username);
            await setDoc(userRef, { photoUrl: url }, { merge: true });
            
            setUser({
                ...loggedInUser,
                photoUrl: url
            });

            resolve();
        });        
    }

    function logOut() {
        auth.signOut();
        setUser(null);
    }

    return (
        <UserContext.Provider value={{ updateProfileImage, logOut, updateUser, status, loggedInUser, error, loading, createUserWithEmail, signInWithEmail }}>
          {children}
        </UserContext.Provider>
    );
}