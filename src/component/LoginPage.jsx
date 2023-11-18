import React from 'react';
import GoogleLoginButton from './GoogleLoginButton';

const LoginPage = () => {
  return (
    <div
      className={"mobile_h_fit w-screen h-screen"}
    >
      <div className="relative top-0 left-0 bg-[url('./assets/login_bg_image_sm.jpg')] md:bg-[url('./assets/login_bg_image_lg.jpg')] h-full bg-cover">
        <div className="absolute h-full w-full bg-black opacity-50" />
        <div className="absolute h-full w-full flex flex-col justify-center items-center text-2xl font-extrabold">
            <p className="text-white">당신의 모든 약속</p>
            <p className="text-white">미티(Meety)로 시작하세요</p>
        </div>
        <div className="absolute bottom-0 pb-4 w-full flex flex-row justify-center">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
