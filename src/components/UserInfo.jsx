import React, { useEffect } from 'react';
import { useRedirectFunctions } from '@propelauth/react';

function UserInfo() {
  const { redirectToAccountPage } = useRedirectFunctions();

  useEffect(() => {
    // Redirect to the account page when the component is mounted
    redirectToAccountPage();
  }, [redirectToAccountPage]);

  return null; // No need to render anything since the user is redirected
}

export default UserInfo;