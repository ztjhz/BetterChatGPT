import { useEffect } from 'react';
import { useClientPrincipal } from "@aaronpowell/react-static-web-apps-auth";

import useStore from '@store/store';

const AuthenticationUpdater = () => {

  //console.log("AuthenticationUpdater Started");

  const setUsername = useStore((state) => state.setUserName);

  const { clientPrincipal, loaded } = useClientPrincipal();

  useEffect(() => {
    if (clientPrincipal) {

      console.log("Authenticated user details:", clientPrincipal);

      // Safely attempt to access claims, if they exist
      const claims = 'claims' in clientPrincipal ? (clientPrincipal as any).claims : null;

      // Attempt to find the name claim, if claims are present
      const nameClaim = claims?.find((claim: any) => claim.typ === 'name');

      // Use the name claim if found, otherwise default to userDetails before the '@' symbol
      const name = nameClaim ? nameClaim.val : clientPrincipal.userDetails.split('@')[0];

      setUsername(name);
    }
  }, [clientPrincipal, loaded, setUsername]);

  return null;
};

export default AuthenticationUpdater