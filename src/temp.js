


import React, { useState, useEffect, Button } from 'react';
import './App.css';
import { Amplify } from 'aws-amplify';
import { awsExports } from './aws-exports';
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Auth } from "aws-amplify";
import Home from './pages/start';
Amplify.configure({
  Auth: {
    region: awsExports.REGION,
    userPoolId: awsExports.USER_POOL_ID,
    userPoolWebClientId: awsExports.USER_POOL_APP_CLIENT_ID
  }
});


function App({ signOut, user }) {
  const [jwtToken, setJwtToken] = useState('');

  useEffect(() => {
    fetchJwtToken();
  }, []);

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      console.log('User signed out successfully');
      // Optionally, you can redirect or perform additional actions after sign-out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const fetchJwtToken = async () => {
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      setJwtToken(token);
    } catch (error) {
      console.log('Error fetching JWT token:', error);
    }
  };
  
   return Home();
}

export default withAuthenticator(App);
