import React from "react";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import { useNavigate } from "react-router";
import GradationButton from "./GradationButton";
import useLoginCheck from "../hooks/useLoginCheck";
import { useRecoilValue } from "recoil";
import { errorContentAtom, errorTitleAtom } from "../store/atoms";


const ErrorPage = () => {
  const navigate = useNavigate();
  const title = useRecoilValue(errorTitleAtom);
  const content = useRecoilValue(errorContentAtom);

  useLoginCheck();

  return (
    <div className="nav_top_padding mobile_h_fit bg-white w-screen h-screen">
      <div className="flex flex-col justify-center items-center w-full h-full pb-20">
        <SentimentDissatisfiedRoundedIcon
          style={{ fontSize: "8rem" }}
          className="text-meety-btn_dark_blue"
        />
        <p className="font-extrabold text-2xl text-wr px-4 pt-4 pb-3">
          {title}
        </p>
        <p className="font-medium text-meety-exp_text_gray text-xs px-10">
          {content}
        </p>
      </div>
      <div className="absolute bottom-0 px-3 mb-7 w-full">
        <GradationButton text={"메인화면으로 이동하기"} onButtonClick={() => navigate("/")} />
        </div>
    </div>
  );
};

export default ErrorPage;
