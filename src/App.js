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
import Loader from './components/Loader';


function App() {

  const FirebaseAuth = ({children, ...rest}) => {
    
    const { loading, status } = useUsersContext();
  
    if(status === 'initializing') {
      return <Loader />
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
            <Header />
            <Routes>
              <Route path='/' exact element={<Home/>} />
              <Route path='/login' element={<Signin/>} />
              <Route path='/signup' element={<Signup/>} />
              <Route path='/:username' element={<Profile/>} />
              <Route path='/:username/edit' element={<EditProfile/>} />
              <Route path='/new-project' element={<NewProject/>} />
              <Route path='/new-project/:projectId' element={<NewProject/>} />
              <Route path='/:username/:projectId' element={<Project />} />
              <Route path='/:username/:projectId/upload' element={<ManageFiles />} />
            </Routes>  
          </Router>
      </FirebaseAuth>
  );
}

export default App;
