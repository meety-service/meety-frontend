import React from "react";
import PageTitle from "./PageTitle";
import { useNavigate } from "react-router-dom";
import GradationButton from "./GradationButton";

const parsedMeetingInfo = {
  meetings: [
    { id: 3, name: "소공 1차 회의", isMaster: 0 },
    { id: 7, name: "프로젝트 2차 설계회의", isMaster: 1 },
    { id: 7, name: "프로젝트 2차 설계회의", isMaster: 1 },
    { id: 7, name: "프로젝트 2차 설계회의", isMaster: 1 },
    { id: 7, name: "프로젝트 2차 설계회의", isMaster: 1 },
    { id: 7, name: "프로젝트 2차 설계회의", isMaster: 1 },
    { id: 7, name: "프로젝트 2차 설계회의", isMaster: 1 },
    { id: 7, name: "프로젝트 2차 설계회의", isMaster: 1 },
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
          <div className="w-full md:w-2/5 h-full py-3 px-3 bg-stone-400 shadow-md shadow-stone-400 rounded-lg">
            <div className="w-full h-full space-y-4 overflow-y-scroll rounded-lg">
              {parsedMeetingInfo.meetings.map((meetingInfo) => (
                <div
                  key={meetingInfo.id}
                  className="h-16 w-full flex flex-row items-center justify-center bg-gradient-to-r rounded-2xl shadow-md border-2 border-solid border-meety-component_outline_gray mx-auto bg-white"
                >
                  <p className="text-lg font-extrabold">{meetingInfo.name}</p>
                </div>
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
