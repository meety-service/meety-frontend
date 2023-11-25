import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosWH } from "../utils/axios";
import { useRecoilState } from "recoil";
import { showNavbarAtom } from "../store/atoms";

function useLoginCheck() {
  const navigate = useNavigate();
  const [navbar, setNavbar] = useRecoilState(showNavbarAtom);

  useEffect(() => {
    console.log("login check");

    const checkUserLoggedIn = async () => {
        // 쿠키에 저장된 refreshToken을 서버로 보내 사용자의 로그인 상태를 확인
        await axiosWH.get("/login/refresh").catch(function (error) {
            console.log(error);
            setNavbar(false);
            navigate('/login'); // 에러 발생 시 로그인 페이지로 이동
        });
    };

    const currPath = window.location.pathname;
    if (currPath == '/login') {
        setNavbar(false);
    } else {
        setNavbar(true);
        checkUserLoggedIn();
    }
  }, []);

  return null; // 컴포넌트에서 사용하지 않는 경우 null을 반환해도 됩니다.
}

export default useLoginCheck;