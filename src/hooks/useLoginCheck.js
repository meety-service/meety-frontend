import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosWH } from "../utils/axios";
import { useRecoilCallback } from "recoil";
import { isSnackbarOpenAtom, showNavbarAtom, snackbarMessageAtom } from "../store/atoms";

function useLoginCheck() {
  const navigate = useNavigate();

  const setNavbar = useRecoilCallback(({ set }) => (bool) => {
    set(showNavbarAtom, bool);
  });

  const openSnackbar = useRecoilCallback(({ set }) => () => {
    set(isSnackbarOpenAtom, true);
  });

  const setSnackbarText = useRecoilCallback(({ set }) => (message) => {
    set(snackbarMessageAtom, message);
  });

  useEffect(() => {
    console.log("login check");

    const currPath = window.location.pathname;

    const checkUserLoggedIn = async () => {
        // 쿠키에 저장된 refreshToken을 서버로 보내 사용자의 로그인 상태를 확인
        await axiosWH.get("/login/refresh").catch(function (error) {
            console.log(error);
            setNavbar(false);
            if (currPath != '/login') {
                navigate('/login');
            } else {
                setSnackbarText("로그인 과정에서 에러가 발생했습니다.");
                openSnackbar(true);
            }
        });
    };

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