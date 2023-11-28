import React, { useEffect, useState } from "react";
import PageTitle from "./PageTitle";
import StepTitle from './StepTitle'
import KeyboardDoubleArrowDown from "@mui/icons-material/KeyboardDoubleArrowDown";
import GradationButton from "./GradationButton";

const MeetingFillPage2 = () => {

  const [nickname, setNickName] = useState("");

  const handleNicknameChange = (event) => {
    setNickName(event.target.value);
  };

  return (
    <div className="nav_top_padding bg-white w-screen h-screen">
      <div className="relative flex flex-col justify-center items-center w-full h-full">
        <div className="absolute top-8 left-4">
          <PageTitle title="미팅 폼 생성하기" />
        </div>
        <div className="relative w-full h-full flex flex-col justify-center items-center px-5 pt-20 pb-28">
          {/*옵션 스크롤 바*/}
          <div className="relative flex flex-col justify-center space-y-2 w-full md:w-2/5 h-fit py-2 px-2 bg-meety-main_background rounded-xl shadow-stone-300 shadow-md">
            <StepTitle
              title="1. 다른 사람에게 보여질 이름을 적어주세요."
              className="left-0 top-0"
            />
            <div className="bg-gradient-to-r from-meety-btn_light_blue to-meety-btn_dark_blue p-1 rounded-full">
              <input
                type="text"
                placeholder="ex) 홍길동"
                value={nickname}
                onChange={handleNicknameChange}
                className="pl-3 h-12 w-full rounded-full"
              />
            </div>
          </div>
          <div className="h-20 flex flex-col justify-center items-center">
            <KeyboardDoubleArrowDown style={{ fill: "#BFBCC6" }} />
          </div>
          <div className="relative flex flex-col justify-center space-y-2 w-full md:w-2/5 h-fit py-2 px-2 bg-meety-main_background rounded-xl shadow-stone-300 shadow-md">
            <StepTitle
              title="2. 미팅이 가능한 시간을 모두 선택해주세요."
              className="left-0 top-0"
            />

          </div>
        </div>

        <StepTitle title="3.미팅이 가능한 시간대를 모두 선택해주세요." />
        <div className="flex flex-col">
          <StepTitle title="표준시(Time Zone)" />
        </div>

        <GradationButton
          text="미팅 폼 생성하기"
          onButtonClick={() => {console.log("clicked")}}
        />
      </div>
    </div>
  );
};

export default MeetingFillPage2;
