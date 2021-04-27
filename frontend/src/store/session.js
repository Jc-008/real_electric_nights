// This file will contain all the actions specific to the session user's information and the session user's Redux reducer.


// frontend/src/store/session.js
import { csrfFetch } from './csrf';

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,              // can just use user, no need to specify payload
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

// phase 2: signup Form page------------------------------------------------------------------------------
export const signup = (user) => async (dispatch) => {         // this is the thunk
  const { username, email, password, location } = user;
  const response = await csrfFetch("/api/users", {          // connect front to backend
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
      location
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));               // dispatch the action of the data and change the store
  return response;
};


export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);            // copy old state
      newState.user = action.payload;               // key into the user and set to new payload
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};

export const restoreUser = () => async dispatch => {
  const response = await csrfFetch('/api/session');
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// phase 3: logout
export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(removeUser());
  return response;
};


export default sessionReducer;
