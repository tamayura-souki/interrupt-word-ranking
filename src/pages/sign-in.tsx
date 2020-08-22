import React from "react"
import {Redirect} from 'react-router-dom';
import firebase from 'firebase'
import StyleedFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import {AuthContext} from '../contexts/Auth'

import {auth} from '../config/firebase'

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: "/",
  signInOptions: [
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
  ],
}

class SignIn extends React.Component {
  render() {
    return (
      <AuthContext.Consumer>
        {(value:any) =>
          value.currentUser ? (
            <Redirect to="/"/>
          ) : (
            <StyleedFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}/>
          )
        }
      </AuthContext.Consumer>
    )
  }
}

export default SignIn