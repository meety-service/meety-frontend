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
    <div className="nav_top_padding mobile-h-fit bg-white w-full h-screen">
      <div className="relative flex flex-col justify-center items-center w-full h-full">
        <div className="relative w-full h-full flex flex-col justify-center items-center px-5 pb-10">
          <div className="relative space-y-2 w-full h-full md:w-2/5 py-2 rounded-xl">
            <div className="absolute h-full w-full flex justify-center items-center">
              <div className="w-full h-full flex flex-col justify-center items-center pt-14 pb-24">
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
                <div className="absolute bottom-0 mb-7 w-full flex flex-col"></div>
              </div>
            </div>
            <div className="absolute w-full bottom-0">
            <GradationButton
              text={"메인화면으로 이동하기"}
              onButtonClick={() => navigate("/")}
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
