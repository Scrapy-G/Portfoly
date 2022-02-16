import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createPortal } from 'react-dom';
import { auth, addDoc, collection, db } from '../../firebase';
import { serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, listAll } from 'firebase/storage';

export const projectSlice = createSlice({
    name: 'project',
    initialState : {
        id: null,
        title: null,
        files: [],
        currentFile: null,
        status: 'idle',
        error: null
    },
        reducers: {
            // addProject: (state, action) => {
            //     state = [...state, action.payload];
            // },
        removeProject: (state) => {
            
        },
        setLoadingStatus: (state) => {
            
        },
        setIdleStatus: (state) => {
            state.status = 'idle'
        }
    },
    extraReducers(builder) {
        builder
            .addCase(createProject.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(createProject.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = "failed"
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.projects.push(action.payload);
                state.status = "success"
            })
            .addCase(fetchProjectById.fulfilled, (state, action) => {
                console.log(action.payload);
                state.status = "success"
            })
    }
});

// export const { login: login, logout: logout } = userSlice.actions;



export const fetchProjectById = createAsyncThunk('projects/fetchProject', async (projectId, { rejectWithValue }) => {

    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
        
        const project = docSnap.data();
        const listRef = ref(getStorage(), auth.currentUser.uid + "/" + projectId + "/");
        const res = await listAll(listRef);
                
        console.log("files", res.items);
        return {
            id: projectId,
            title: project.title,
            files: res.items
        }
    }else {
        return rejectWithValue("Project not found");
    }    
    
});

export default projectSlice.reducer;

export const selectProjects = (state) => state.projects.projects;

export const projectsStatus = (state) => state.projects.status;

export const createProject = createAsyncThunk('projects/addProject', async ({title, isPrivate}) => {
    console.log(serverTimestamp());
    const newProject = {
        title,
        isPrivate,
        user: auth.currentUser.uid
    }
    const docRef = await addDoc(collection(db, 'projects'), {
        ...newProject,
        timestamp: serverTimestamp()
    });

    return {
        ...newProject, 
        id: docRef.id        
    };
});