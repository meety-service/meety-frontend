import React from "react";
import { ReactComponent as GoogleBtnImage } from "../assets/web_neutral_sq_ctn.svg";
// import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleLoginButtonRenewal = () => {
  
  const GoogleAuthAccessURL = (() => {
    const accessUrl = new URL(process.env.REACT_APP_GOOGLE_OAUTH_AUTHORIZATION_ENDPOINT);
    accessUrl.searchParams.set('client_id', process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID);
    accessUrl.searchParams.set('redirect_uri', process.env.REACT_APP_REDIRECT_URL);
    accessUrl.searchParams.set('response_type', 'code');
    accessUrl.searchParams.set('scope', process.env.REACT_APP_GOOGLE_OAUTH_AUTH_SCOPE);
    accessUrl.searchParams.set('access_type', 'offline');
    accessUrl.searchParams.set('prompt', 'consent');
    return accessUrl.toString();
  })();
  
  return (
    <button
      onClick={() => {
        window.location.href = GoogleAuthAccessURL;
      }}
      className="w-fit h-fit"
    >
      <GoogleBtnImage width="100%" />
    </button>
  );
};

export default GoogleLoginButtonRenewal;
