import React, { useCallback, useEffect, useState } from "react";
import PageTitle from "./PageTitle";
import { useNavigate } from "react-router-dom";
import GradationButton from "./GradationButton";
import MainOptionButton from "./MainOptionButton";
import { axiosWH, getMeetingInfo } from "../utils/axios";
import useLoginCheck from "../hooks/useLoginCheck";

const MainPage = () => {
  const navigate = useNavigate();
  const [meetingInfo, setMeetingInfo] = useState([]);

  // 사용자의 state 확인 후 어느 페이지로 이동할지 결정
  const getNavigationUrl = useCallback((id, state) => {
    switch (state) {
      case 0: // 미팅 폼 작성 이전 -> 미팅 폼 작성 페이지
        return `/meeting/fill/${id}`;
      case 1: // 미팅 폼 작성 이후 -> 미팅 폼 작성 완료 페이지
        return `/meeting/view/${id}`;
      case 2: // 투표 참여 이전 -> 투표 폼 작성 페이지
        return `/vote/fill/${id}`;
      case 3: // 투표 참여 이전 -> 투표 폼 작성 완료 페이지
        return `/vote/view/${id}`;
      case 4: // 미팅 확정 -> 미팅 확정 페이지
        return `/meeting/confirmed/${id}`;
      default: // user_status 에러 -> 에러 페이지
        return `/error`;
    }
  });

  useLoginCheck(); // 로그인 여부 확인 -> 미 로그인 시 로그인 페이지로 이동

  // 서버에서 미팅 정보 fetch
  useEffect(() => {
    const fetchData = async () => {
      // 실제로 서버에서 데이터 fetch
      await axiosWH
        .get("/meetings")
        .then((response) => {
          setMeetingInfo(response.data);  // 사용자의 미팅 정보 저장
        })
        .catch(function (error) {
          if (error.response) {
            // 요청이 전송되었고, 서버가 2xx 외의 상태 코드로 응답한 경우
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // 요청이 전송되었지만, 응답이 수신되지 않은 경우
            console.log(error.request);
          } else {
            // 오류가 발생한 요청을 설정하는 동안 문제가 발생한 경우
            console.log("Error", error.message);
          }
          console.log(error.config);
        });

        // 테스트용 더미 데이터 fetch
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
              {meetingInfo.map((info) => (
                <MainOptionButton
                  key={info.id}
                  text={info.name}
                  isMaster={info.isMaster}
                  onButtonClick={() => {
                    const url = getNavigationUrl(info.id, info.user_state);
                    navigate(url);
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
