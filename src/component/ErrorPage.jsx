import React from "react";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import { useNavigate } from "react-router";
import GradationButton from "./GradationButton";
import useLoginCheck from "../hooks/useLoginCheck";

let errorMessage = {
  error_message: "원하시는 페이지를 찾을 수 없습니다.",
  error_content:
    "찾으시려는 페이지의 주소가 잘못 입력되었거나, 페이지 주소의 변경 혹은 삭제로 인해 현재 사용하실 수 없습니다.",
};

const ErrorPage = () => {
  const navigate = useNavigate();

  useLoginCheck();

  return (
    <div className="nav_top_padding mobile_h_fit bg-white w-screen h-screen">
      <div className="flex flex-col justify-center items-center w-full h-full pb-20">
        <SentimentDissatisfiedRoundedIcon
          style={{ fontSize: "8rem" }}
          className="text-meety-btn_dark_blue"
        />
        <p className="font-extrabold text-2xl text-wr px-4 pt-4 pb-3">
          {errorMessage.error_message}
        </p>
        <p className="font-medium text-meety-exp_text_gray text-xs px-10">
          {errorMessage.error_content}
        </p>
      </div>
      <div className="absolute bottom-0 px-3 mb-7 w-full">
        <GradationButton text={"메인화면으로 이동하기"} onButtonClick={() => navigate("/")} />
        </div>
    </div>
  );
};

export default ErrorPage;
