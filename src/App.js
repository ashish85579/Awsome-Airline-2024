import React, { useState, useEffect } from "react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { awsExports } from "./aws-exports";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Auth } from "aws-amplify";
import Start from "./pages/start";

Amplify.configure({
  Auth: {
    region: awsExports.REGION,
    userPoolId: awsExports.USER_POOL_ID,
    userPoolWebClientId: awsExports.USER_POOL_APP_CLIENT_ID,
  },
});

function App() {
  useEffect(() => {
    fetchJwtToken();
  }, []);

  const fetchJwtToken = async () => {
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      localStorage.setItem("token", token);
    } catch (error) {
      console.log("Error fetching JWT token:", error);
    }
  };

  return (
    <Authenticator
      initialState="signIn"
      components={{
        SignUp: {
          FormFields() {
            return (
              <>
                <Authenticator.SignUp.FormFields />
                <div>
                  <label>First name</label>
                </div>
                <input
                  type="text"
                  name="given_name"
                  placeholder="Please enter your first name"
                />
                <div>
                  <label>Last name</label>
                </div>
                <input
                  type="text"
                  name="family_name"
                  placeholder="Please enter your last name"
                />
                <div>
                  <label>Email</label>
                </div>
                <input
                  type="text"
                  name="email"
                  placeholder="Please enter a valid email"
                />
              </>
            );
          },
        },
      }}
      services={{
        async validateCustomSignUp(formData) {
          if (!formData.given_name) {
            return {
              given_name: "First Name is required",
            };
          }
          if (!formData.family_name) {
            return {
              family_name: "Last Name is required",
            };
          }
          if (!formData.email) {
            return {
              email: "Email is required",
            };
          }
        },
      }}
    >
      {({ signOut, user }) => <Start />}
    </Authenticator>
  );
}

export default App;
