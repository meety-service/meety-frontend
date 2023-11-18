import React from "react";
import { useNavigate } from "react-router";
import GradationButton from "./GradationButton";
import PageTitle from "./PageTitle";
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';

let confirmedDateList = [
  "10월 6일 (금) 16:30 ~ 18:00",
  "10월 7일 (토) 18:30 ~ 20:00",
];

const MeetingConfirmedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="nav_top_padding mobile_h_fit bg-white w-screen h-screen">
      <div className="relative flex flex-col justify-center items-center w-full h-full">
        {/*페이지 타이틀*/}
        <div className="absolute top-0 left-0 mt-8 ml-4">
          <PageTitle title="미팅 확정" />
        </div>
        {/*옵션 스크롤*/}
        <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="w-full md:w-2/5 flex flex-row items-center space-x-2 pl-5 md:pl-1 mb-2">
                <EventAvailableRoundedIcon style={{ fill: "#1B51DC" }}/>
                <p className="font-extrabold text-md">미팅 날짜가 결정되었어요!</p>
            </div>
            <div className="space-y-4 w-full max-h-[50%] overflow-y-scroll py-2 px-5 mb-10 rounded-lg">
            {/*개별 옵션*/}
            {confirmedDateList.map((date, index) => (
                <div
                key={index}
                className="h-16 w-full md:w-2/5 flex flex-row items-center justify-center bg-gradient-to-r rounded-2xl shadow-md border-2 border-solid border-meety-component_outline_gray mx-auto"
                >
                <p className="text-lg font-extrabold">{date}</p>
                </div>
            ))}
            </div>
        </div>
        <div className="absolute bottom-0 px-3 mb-7 w-full">
          <GradationButton
            text={"메인화면으로 이동하기"}
            onButtonClick={() => navigate("/")}
          />
        </div>
      </div>
    </div>
  );
};

export default MeetingConfirmedPage;
