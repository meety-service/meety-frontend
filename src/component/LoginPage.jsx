import React, { useEffect, useState } from 'react';

const LoginPage = () => {
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
      // 페이지가 로드될 때 페이드 인 효과 시작
      setFadeIn(true);
    }, []);

  return (
    <div
      className={"nav_top_padding mobile_h_fit w-screen h-screen"}
    >
      <div className="bg-[url('./assets/login_bg_image_sm.jpg')] md:bg-[url('./assets/login_bg_image_lg.jpg')] bg-cover h-full">
        <div className="h-full w-full bg-black opacity-50">
            
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
