import React from "react";
import { ReactComponent as GoogleBtnImage } from "../assets/web_neutral_sq_ctn.svg";
// import { useGoogleLogin } from "@react-oauth/google";

const GoogleLoginButtonRenewal = () => {
  
  return (
    <button
      onClick={() => {

        const scope = ['https://www.googleapis.com/auth/userinfo.email'].join(' ');
        const access_type = "offline"
        const prompt = "consent"

        const accessUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        accessUrl.searchParams.set('client_id', process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID);
        accessUrl.searchParams.set('redirect_uri', process.env.REACT_APP_REDIRECT_URL);
        accessUrl.searchParams.set('response_type', 'code');
        accessUrl.searchParams.set('scope', scope);
        accessUrl.searchParams.set('access_type', access_type);
        accessUrl.searchParams.set('prompt', prompt);

        const GoogleAuthAccessURL = accessUrl.toString();

      window.location.href = GoogleAuthAccessURL;
  }
      }
      className="w-fit h-fit"
    >
      <GoogleBtnImage width="100%" />
    </button>
  );
};

export default GoogleLoginButtonRenewal;
