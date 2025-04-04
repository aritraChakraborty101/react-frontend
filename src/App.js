import React from 'react';
import { useLogoutFunction, useRedirectFunctions, withAuthInfo } from '@propelauth/react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route from react-router-dom
import Home from './components/Home'; // Import the Home component
import UserInfo from './components/UserInfo'; // Import the UserInfo component
import AuthenticatedRequest from './components/AuthenticatedRequest'; // Import the AuthenticatedRequest component
import ListOfOrgs from './components/ListOfOrgs'; // Import the ListOfOrgs component
import OrgInfo from './components/OrgInfo'; // Import the OrgInfo component


const App = withAuthInfo(({ isLoggedIn }) => {
  const logoutFn = useLogoutFunction();
  const { redirectToSignupPage, redirectToLoginPage } = useRedirectFunctions();

  if (isLoggedIn) {
    return (
      <div>
        <p>The User is logged in</p>
        <button onClick={() => logoutFn(true)}>Click here to log out</button>
        <Routes>
          <Route path="./auth" element={<AuthenticatedRequest/>}/> 
          <Route exact path="/" element={<Home />} />
          <Route path="/user_info" element={<UserInfo />} />
          <Route path="/orgs" element={<ListOfOrgs/>}/>
          <Route path="/org/:orgName" element={<OrgInfo/>}/>

        </Routes>
      </div>
    );
  } else {
    return (
      <div>
        To get started, please log in as test user.
        <br />
        <button onClick={() => redirectToSignupPage()}>Sign up</button>
        <button onClick={() => redirectToLoginPage()}>Log in</button>
      </div>
    );
  }
});

export default App;