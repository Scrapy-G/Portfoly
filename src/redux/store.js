import { configureStore, combineReducers, applyMiddleware, createStore } from "@reduxjs/toolkit";
import projectSlice from "./slices/projectSlice";
import userReducer from "./slices/userSlice";

const logger = store => next => action => {
    console.log("action: ", action);
    return next(action);
}

const store = configureStore({
    reducer: {
        user: userReducer, 
        projects: projectSlice       
    }
});

export default store;