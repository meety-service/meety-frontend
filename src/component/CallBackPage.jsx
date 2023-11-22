import React, { useEffect } from 'react'
import { ReactComponent as CircularIndicator } from "../assets/circular_indicator.svg";
import { useNavigate } from 'react-router-dom';
import { getCookie, setCookie } from '../utils/cookie';
import axios from 'axios';

// TODO : 헤더에 cookie 포함하는 로직 구현 필요

const CallBackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const code = urlSearchParams.get("code");

      if (code) {
        // Authorization code 확인
        console.log(code);

        // 서버에 Authorization code 전달 및 응답 받기
        const response = await axios.get("http://localhost:8080/login", {
          params: {
            code: code 
          }
        })

        console.log(response);
        
        // 서버에서 쿠키 저장
        setCookie('X-Gapi-Refresh-Token', 'Refresh Token', {
          path: '/',
          secure: true,
          maxAge: 315360000
        })
        console.log(getCookie('X-Gapi-Refresh-Token'));

        // 페이지 전환을 위해 useNavigate 호출
        navigate('/');
      }
    })();
  }, []);


  return (    
    <div className="nav_top_padding mobile_h_fit bg-white w-screen h-screen">
        <div className="flex flex-col justify-center items-center w-full h-full">
            <div className="h-fit w-fit animate-spin">
                <CircularIndicator width="40px"/>
            </div>
        </div>
    </div>

  )
}

export default CallBackPage
