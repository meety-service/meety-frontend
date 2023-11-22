import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookie";

function useLoginCheck() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const refreshToken = getCookie('X-Gapi-Refresh-Token');

        // refreshToken을 서버로 보내 로그인 상태를 확인
        await axios.get("http://localhost:8080/login/refresh", {
          withCredentials: true,
          headers: {
            Cookie: `X-Gapi-Refresh-Token=${refreshToken};`
          }
        }).catch(function (error) {
            navigate('/login'); // 에러 발생 시 로그인 페이지로 이동
        });
      } catch (error) {
        console.log("Outer error")
        navigate('/login'); // 에러 발생 시 로그인 페이지로 이동
      }
    };

    checkUserLoggedIn();
  });

  return null; // 컴포넌트에서 사용하지 않는 경우 null을 반환해도 됩니다.
}

export default useLoginCheck;