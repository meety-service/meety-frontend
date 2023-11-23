import React from "react";
import GoogleLoginButtonRenewal from "./GoogleLoginButtonRenewal";
import { GoogleOAuthProvider } from "@react-oauth/google";

const LoginPage = () => {
  return (
    <div className={"mobile_h_fit w-screen h-screen"}>
      <div className="relative top-0 left-0 bg-[url('./assets/login_bg_image_sm.jpg')] md:bg-[url('./assets/login_bg_image_lg.jpg')] h-full bg-cover flex flex-col justify-center items-center">
        <div className="absolute h-full w-full bg-black opacity-50" />
        <div className="absolute h-full w-full flex flex-col justify-center items-center text-2xl font-extrabold">
          <p className="text-white">당신의 모든 약속</p>
          <p className="text-white">미티(Meety)로 시작하세요</p>
        </div>
        <div className="absolute bottom-0 pb-4 px-3 w-full max-w-[290px] flex flex-row justify-center items-center">
          <GoogleOAuthProvider
            clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}
          >
            <GoogleLoginButtonRenewal />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
