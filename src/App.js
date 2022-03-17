import Signup from './pages/Signup';
import Signin from './pages/Signin';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Profile from './pages/Profile';
import Header from './components/Header';
import { auth, authStateChanged } from "./firebase";
import Home from './pages/Home';
import { useEffect, useState, useContext } from 'react';
import EditProfile from './pages/EditProfile';
import { RotateLoader } from 'react-spinners';
import NewProject from './pages/NewProject';
import Project from './pages/Project/Project';
import ManageFiles from './pages/ManageFiles';
import { useUsersContext } from './contexts/UserContext';
import Loader from './components/Loader';
import { useToastContext } from './contexts/ToastContext';
import { Toast, ToastContainer } from 'react-bootstrap';
import PasswordRest from './pages/PasswordReset';

function App() {

  const FirebaseAuth = ({children, ...rest}) => {
    
    const { status } = useUsersContext();
  
    if(status === 'initializing') {
      return <Loader />
    }
    
    return (
      <div {...rest}>
        {children}
      </div>
    );
  }

  const ToastMessage = () => {

    const { toast, show } = useToastContext();

    if(!toast)
      return <></>
      
    return (
      <ToastContainer>
        <Toast show={show} className={toast.type}>
          <Toast.Body className="py-3 px-4">{toast?.text}</Toast.Body>
        </Toast>
      </ToastContainer>
    )

  }

  function PrivateRoute({ children }) {
    const {loggedInUser } = useUsersContext();
    return loggedInUser ? <Outlet /> : <Navigate to="/login" />;
  }
  

  return (
    <>
      <FirebaseAuth>
        <Router>
          <Header />
          <Routes>
            <Route path='/' exact element={<Home/>} />
            <Route path='/login' element={<Signin/>} />
            <Route path='/signup' element={<Signup/>} />
            <Route path='/password-reset' element={<PasswordRest/>} />
            <Route path='/:username' element={<Profile/>} />
            <Route path='/:username/edit' element={<PrivateRoute/>}>
              <Route path='/:username/edit' element={<EditProfile/>}/>
            </Route>
            <Route path='/new-project' element={<PrivateRoute/>}>
              <Route path='/new-project' element={<NewProject/>}/>
            </Route>
            <Route path='/new-project/:projectId' element={<PrivateRoute/>}>
              <Route path='/new-project/:projectId' element={<NewProject/>}/>
            </Route>
            <Route path='/:username/:projectId' element={<Project />} />
            <Route path='/:username/:projectId/upload' element={<PrivateRoute/>}>
              <Route path='/:username/:projectId/upload' element={<ManageFiles />} />
            </Route>
          </Routes>  
        </Router>
      </FirebaseAuth>
      <ToastMessage />
    </>
  );
}

export default App;
