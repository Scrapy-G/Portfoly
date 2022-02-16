import Signup from './pages/Signup';
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import store from './redux/store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import Profile from './pages/Profile';
import Header from './components/Header';
import { auth, authStateChanged } from "./firebase";
import { selectUser, setUser } from './redux/slices/userSlice';
import Home from './pages/Home';
import { useEffect, useState } from 'react';
import EditProfile from './pages/EditProfile';
import { RotateLoader } from 'react-spinners';
import NewProject from './pages/NewProject';
import Project from './pages/Project/Project';
import ManageFiles from './pages/ManageFiles';


function App() {

  const FirebaseAuth = ({children, ...rest}) => {
    
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
      authStateChanged(auth, (user) => {
        if (user) {
          dispatch(setUser(user.displayName));
        } 
        setLoading(false);

      });
    }, [auth, dispatch]);
    
    if(loading) {
      return (
        <div 
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <RotateLoader/> 
        </div>
      );
    }
    
    return (
      <div {...rest}>
        {children}
      </div>
    );
  }

  return (
    <Provider store={store}>
      <FirebaseAuth>
          <Router>
            <Header />
            <Routes>
              {/* <Route path='/' element={<Header/>} /> */}
              <Route path='/' exact element={<Home/>} />
              <Route path='/login' element={<Login/>} />
              <Route path='/signup' element={<Signup/>} />
              <Route path='/profile' element={<Profile/>} />
              <Route path='/edit-profile' element={<EditProfile/>} />
              <Route path='/new-project' element={<NewProject/>} />
              <Route path='/projects/:projectId' element={<Project />} />
              <Route path='/projects/:projectId/upload' element={<ManageFiles />} />
            </Routes>  
          </Router>
      </FirebaseAuth>
    </Provider>
  );
}

export default App;
