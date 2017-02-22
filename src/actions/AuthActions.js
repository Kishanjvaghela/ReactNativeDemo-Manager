import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILED
} from './types';
import { showProgress, hideProgress } from './ProgressAction';

export const emailChange = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  };
};

export const loginUser = ({ email, password }) => {
  console.log('login user action called');
  return (dispatch) => {
    dispatch(showProgress());
    firebase.auth().signInWithEmailAndPassword(email,password)
      .then(user => {
        console.log('signInWithEmailAndPassword then');
        onLoginSuccess(dispatch, user);
      })
      .catch((error) => {
        console.log('signInWithEmailAndPassword catch',error);
        if(error !== undefined && error.code === 'auth/user-not-found'){
          console.log(' creating new user');
          firebase.auth().createUserWithEmailAndPassword(email,password)
            .then(user => onLoginSuccess(dispatch,user))
            .catch((error) => onLoginFailed(dispatch,error.message));
        }else{
          onLoginFailed(dispatch,error.message)
        }
      });
  };
};

const onLoginSuccess = (dispatch, user) => {
  dispatch(hideProgress());
  const returnObj = {
    type: LOGIN_USER_SUCCESS,
    payload: user
  }
  dispatch(returnObj);
  Actions.main();
}

const onLoginFailed = (dispatch, errorString) => {
  dispatch(hideProgress());
    console.log('onLoginFailed');
    dispatch({
       type: LOGIN_USER_FAILED,
       payload: errorString
     });
}
