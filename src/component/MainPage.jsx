import React, { useEffect, useState } from "react";
import PageTitle from "./PageTitle";
import { useNavigate } from "react-router-dom";
import GradationButton from "./GradationButton";
import MainOptionButton from "./MainOptionButton";
import { getMeetingInfo } from "../utils/axios";


// 사용자의 state 확인 후 어느 페이지로 이동할지 결정
const getNavigationUrl = (id, state) => {
  switch(state) {
    case 0:
      return `/meeting/fill/${id}`
    case 1:
      return `/meeting/view/${id}`
    case 2:
      return `/vote/fill/${id}`
    case 3:
      return `/vote/view/${id}`
    case 5:
      return `/meeting/confirmed/${id}`
    default:
      return `/error`
  }
}


const MainPage = () => {
  const navigate = useNavigate();

  const [meetingInfo, setMeetingInfo] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      await getMeetingInfo().then((data) => {
        setMeetingInfo(data.meetings)
      });
    };
    fetchData();
  }, []);

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
              {meetingInfo  .map((info) => (
                <MainOptionButton
                  key={info.id}
                  text={info.name}
                  isMaster={info.isMaster}
                  onButtonClick={() => {
                    const url = getNavigationUrl(info.id, info.user_state)
                    navigate(url, { replace: true });
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
