import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Icon } from "../assets/logo.svg";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import NoAccountsRoundedIcon from "@mui/icons-material/NoAccountsRounded";
import { removeCookie } from "../utils/cookie";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { isSnackbarOpenAtom, showNavbarAtom, snackbarMessageAtom } from "../store/atoms";
import { axiosWH } from "../utils/axios";
import { useErrorCheck } from "../hooks/useErrorCheck";

const Navbar = () => {
  const navbar = useRecoilValue(showNavbarAtom);
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const [error, handleError] = useState(undefined);
  const navigate = useNavigate();

  useErrorCheck(error);

  const openSnackbar = useRecoilCallback(({ set }) => () => {
    set(isSnackbarOpenAtom, true);
  });

  const setSnackbarText = useRecoilCallback(({ set }) => (message) => {
    set(snackbarMessageAtom, message);
  });

  const handleLogoutButtonClick = () => {
    console.log("Logout");
    removeCookie(process.env.REACT_APP_USER_TOKEN);

    setSnackbarText("로그아웃 되었습니다.");
    openSnackbar();

    navigate("/login");
  };

  const handleRevokeAccessButtonClick = () => {
    console.log("Revoke Access");
  
    axiosWH
    .get("/login/withdraw")
    .then((response) => {
      console.log(response.data);
      removeCookie(process.env.REACT_APP_USER_TOKEN);

      setSnackbarText("회원 탈퇴 되었습니다.");
      openSnackbar();

      navigate(`/login}`);
    })
    .catch((error) => {
      handleError(error);
    });
  };

  return (
    <>
      {/*상단 네비게이션 바*/}
      <div className="navbar">
        <div className={`${navbar ? "" : "navbar-hide"} fixed h-[60px] w-screen z-20 flex items-center justify-between px-3 bg-white shadow-lg`}>
          <Link to="/" className="flex items-center space-x-3">
            <Icon width="80px" />
          </Link>
          <button
            className="z-40 flex items-center justify-center"
            onClick={showSidebar}
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <MenuRoundedIcon fontSize="large" style={{ fill: "#1B51DC" }} />
          </button>
        </div>
      </div>
      {/*사이드 바*/}
      <div
        onClick={showSidebar}
        className={`${
          navbar ? (sidebar
            ? "fixed bg-black w-screen h-screen flex justify-center z-30 bg-opacity-30 transition ease-in-out duration-300"
            : "transition ease-out duration-300 bg-opacity-30") : "navbar-hide"
        }`}
      ></div>
      <nav
        className={`nav-menu ${
          navbar ? (sidebar ? "active" : "") : "navbar-hide"
        } fixed bg-white w-3/5 md:w-1/4 h-screen flex justify-center z-30  rounded-tl-[20px] rounded-bl-[20px]`}
      >
        <div className="w-full h-full">
          <div className="relative h-[180px] flex flex-col justify-center items-center bg-gradient-to-r from-meety-btn_light_blue to-meety-btn_dark_blue rounded-tl-[20px] rounded-bl-[20px]">
            {/* 사이드바 닫는 버튼 */}
            <div className="absolute top-0 right-0 pr-3 z-50 h-[60px] flex flex-row">
              <button
                className="z-40 flex items-center justify-center"
                onClick={showSidebar}
                aria-controls="navbar-default"
                aria-expanded="false"
              >
                <KeyboardArrowRightRoundedIcon
                  fontSize="large"
                  style={{ fill: "#FFFFFF" }}
                />
              </button>
            </div>
            <div className="pt-4">
              {/* 사용자 이미지 */}
              <div className="flex flex-col justify-center items-center">
                <div className="w-[58px] h-[58px] border-2 border-solid border-white bg-[#689F38] rounded-full flex justify-center items-center font-bold text-xl text-white">
                  J
                </div>
              </div>
              {/* 이메일 텍스트 */}
              <div className="text-white text-sm m-2">sample@gmail.com</div>
            </div>
          </div>
          <div className="flex flex-col space-y-2 pt-2 w-full h-full px-2">
            <button
              onClick={() => {
                handleLogoutButtonClick();
              }}
              className="flex flex-row justify-start items-center pl-2 w-full h-10 bg-white text-[#4777F1] active:bg-gradient-to-r active:from-meety-btn_light_blue active:to-meety-btn_dark_blue active:text-white rounded-md transition-all duration-100 ease-in-out"
            >
              <LogoutIcon fontSize="small" />
              <div className="pl-2">로그아웃</div>
            </button>
            <button
              onClick={() => {
                handleRevokeAccessButtonClick();
              }}
              className="flex flex-row justify-start items-center pl-2 w-full h-10 bg-white text-[#4777F1] active:bg-gradient-to-r active:from-meety-btn_light_blue active:to-meety-btn_dark_blue active:text-white rounded-md transition-all duration-100 ease-in-out"
            >
              <NoAccountsRoundedIcon fontSize="small" />
              <div className="pl-2">회원 탈퇴</div>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
