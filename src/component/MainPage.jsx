import React from "react";
import PageTitle from "./PageTitle";
import { useNavigate } from "react-router-dom";
import GradationButton from "./GradationButton";
import MainOptionButton from "./MainOptionButton";

const parsedMeetingInfo = {
  meetings: [
    { id: 3, name: "소공 1차 회의", isMaster: 0 },
    { id: 7, name: "프로젝트 2차 설계 회의", isMaster: 1 },
    { id: 404, name: "집에 보내줘..", isMaster: 0 },
  ],
};

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="nav_top_padding mobile_h_fit bg-white w-screen h-screen">
      <div className="relative flex flex-col justify-center items-center w-full h-full">
        <div className="absolute top-8 left-4">
          <PageTitle title="내 미팅" />
        </div>
        <div className="w-full h-full flex flex-col justify-center items-center px-5 pt-20 pb-28">
          {/*옵션 스크롤 바*/}
          <div className="w-full md:w-2/5 h-full py-2 px-2 bg-meety-main_background rounded-xl shadow-stone-300 shadow-md">
            <div className="w-full h-full space-y-4 overflow-y-scroll scrollbar-hide p-1 rounded-xl shadow-sm">
              {parsedMeetingInfo.meetings.map((meetingInfo) => (
                <MainOptionButton
                  key={meetingInfo.id}
                  text={meetingInfo.name}
                  isMaster={meetingInfo.isMaster}
                  onButtonClick={() => {
                    console.log(meetingInfo.id);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="absolute h-[60px] w-full bottom-0 left-0">
          <div className="absolute bottom-0 px-5 mb-7 w-full h-full ">
            <GradationButton
              text={"새로운 미팅 생성하기"}
              onButtonClick={() => navigate("/meeting/create")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
