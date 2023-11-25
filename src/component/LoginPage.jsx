import React, { useEffect, useState } from "react";
import GoogleLoginButtonRenewal from "./GoogleLoginButtonRenewal";
import useLoginCheck from "../hooks/useLoginCheck";

const LoginPage = () => {
  const [showAnimation, setAnimation] = useState(false);
  const [showAnimation2, setAnimation2] = useState(false);
  const [showAnimation3, setAnimation3] = useState(false);
  useEffect(() => {
    setAnimation(true);
    const timer1 = setTimeout(() => {
      setAnimation2(true);
    }, 300);
    const timer2 = setTimeout(() => {
      setAnimation3(true);
    }, 500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  });

  useLoginCheck();

  return (
    <div className={"mobile_h_fit w-screen h-screen bg-black"}>
      <div className="relative top-0 left-0 bg-[url('./assets/login_bg_image_sm.jpg')] md:bg-[url('./assets/login_bg_image_lg.jpg')] h-full bg-cover flex flex-col justify-center items-center">
        <div
          className={`${
            showAnimation ? "login-fade-in-bg opacity-50" : "opacity-70"
          } absolute h-full w-full bg-black`}
        />
        <div className="text-white absolute h-full w-full flex flex-col justify-center items-center text-2xl font-extrabold">
          <p className={`${showAnimation ? "login-fade-in-1" : "opacity-0"}`}>
            당신의 모든 약속
          </p>
          <p className={`${showAnimation2 ? "login-fade-in-2" : "opacity-0"}`}>
            미티(Meety)로 시작하세요
          </p>
        </div>
        <div className={`${showAnimation3 ? "login-fade-in-btn" : "opacity-0"} absolute bottom-0 pb-4 px-3 w-full max-w-[290px] flex flex-row justify-center items-center`}>
          <GoogleLoginButtonRenewal />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
