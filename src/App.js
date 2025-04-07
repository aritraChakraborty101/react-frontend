import React, { useEffect } from 'react';
import { useLogoutFunction, useRedirectFunctions, withAuthInfo } from '@propelauth/react';
import { Routes, Route } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import Home from './components/Home';
import UserInfo from './components/UserInfo';
import AuthenticatedRequest from './components/AuthenticatedRequest';
import ListOfOrgs from './components/ListOfOrgs';
import OrgInfo from './components/OrgInfo';
import { syncUser } from './api/api';

const App = withAuthInfo(({ isLoggedIn, accessToken }) => {
  const logoutFn = useLogoutFunction();
  const { redirectToSignupPage, redirectToLoginPage } = useRedirectFunctions();

  let userInfo = {};
  if (accessToken) {
    userInfo = jwtDecode(accessToken); // Decode the token
    console.log('Decoded Token:', userInfo);
  }

  const { user_id: userId, email, first_name: firstName, last_name: lastName } = userInfo;

  useEffect(() => {
    const syncUserWithBackend = async () => {
      try {
        const userPayload = {
          userId,
          email,
          name: `${firstName} ${lastName}`,
        };
        await syncUser(userPayload); // Send user info to the backend
        console.log('User synced successfully');
      } catch (error) {
        console.error('Error syncing user:', error);
      }
    };

    if (userId && email) {
      syncUserWithBackend();
    }
  }, [userId, email, firstName, lastName]);

  if (isLoggedIn) {
    return (
      <div>
        <p>The User is logged in</p>
        <button onClick={() => logoutFn(true)}>Click here to log out</button>
        <Routes>
          <Route path="./auth" element={<AuthenticatedRequest />} />
          <Route exact path="/" element={<Home />} />
          <Route path="/user_info" element={<UserInfo />} />
          <Route path="/orgs" element={<ListOfOrgs />} />
          <Route path="/org/:orgName" element={<OrgInfo />} />
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