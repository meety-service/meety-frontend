import React, { useEffect } from "react";
import { ReactComponent as CircularIndicator } from "../assets/circular_indicator.svg";
import { useNavigate } from "react-router-dom";
import { getCookie, setCookie } from "../utils/cookie";

// TODO : 헤더에 cookie 포함하는 로직 구현 필요

const StandbyView = () => {
  return (
    <div className="nav_top_padding mobile_h_fit bg-white w-screen h-screen">
        <div className="flex flex-col justify-center items-center w-full h-full">
            <div className="h-fit w-fit animate-spin">
                <CircularIndicator width="40px"/>
            </div>
        </div>
    </div>
  );
};

export default StandbyView;
