import { ActionTypes } from "../constants/action-types"

const initialState = {
    user: null
}

export const userReducer = (state = initialState, { type, payload }) => {
    switch(type){
        case ActionTypes.LOGIN:
            break;
        case ActionTypes.LOGOUT:
            return ({user: null});
        default:
            return;
    }
}