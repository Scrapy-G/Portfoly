import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth, addDoc, collection, db } from '../../firebase';

export const userSlice = createSlice({
    name: 'user',
    initialState : {
        user: null,
        status: 'idle',
        error: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.status = 'idle';
        },
        removeUser: (state) => {
            state.user = null;
        },
        setUserLoadingStatus: (state) => {
            state.status = 'loading'
        },
        setUserIdleStatus: (state) => {
            state.status = 'idle'
        }
    },
    extraReducers(builder) {
        builder
            .addCase(loginNewUser.pending, (state, action) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(loginNewUser.fulfilled, (state, action) => {
                state.error = null;
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(loginNewUser.rejected, (state, action) => {
                console.log(action.meta);
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
});

// export const { login: login, logout: logout } = userSlice.actions;

export const loginNewUser = createAsyncThunk('user/setUser', async ({email, password}) => {
    const response = await signInWithEmailAndPassword(auth, email, password);
    return response.user.displayName;
});

export const registerUser = createAsyncThunk('user/setUser', async ({name, email, password}) => {
    const response = await createUserWithEmailAndPassword(auth, email, password);

    await addDoc(collection(db, 'users'), {
        id: auth.currentUser.uid,
        name: name
    });
    console.log({name})
    return name;
});

export const signOutUser = createAsyncThunk('user/setUser', async () => {
    console.log("signing out");
    await auth.signOut();
    return "";
});

export const updateUserProfile = createAsyncThunk('user/setUser', async (credentials) => {
    console.log(credentials);
    return credentials;
});

export const { setUser, setUserLoadingStatus, setUserIdleStatus } = userSlice.actions;

export default userSlice.reducer;

export const selectUser = (state) => state.user.user;

export const userState = (state) => state.user.status;