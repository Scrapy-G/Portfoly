import Signup from './pages/Signup';
import Signin from './pages/Signin';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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


function App() {

  const FirebaseAuth = ({children, ...rest}) => {
    
    const { loading, status } = useUsersContext();

    if(status === 'initial') {
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
      <FirebaseAuth>
          <Router>
            <Routes>
              {/* <Route path='/' element={<Header/>} /> */}
              <Route path='/' exact element={<Home/>} />
              <Route path='/login' element={<Signin/>} />
              <Route path='/signup' element={<Signup/>} />
              {/* <Route path='/:user' element={<Header/>} /> */}
              <Route path='/:username' element={<Profile/>} />
              {/*<Route path='/edit-profile' element={<EditProfile/>} />
              <Route path='/new-project' element={<NewProject/>} />
              <Route path='/new-project/:projectId' element={<NewProject/>} /> */}
              <Route path='/:username/:project' element={<Project />} />
              {/* <Route path='/projects/:projectId/upload' element={<ManageFiles />} /> */}
            </Routes>  
          </Router>
      </FirebaseAuth>
  );
}

export default App;
