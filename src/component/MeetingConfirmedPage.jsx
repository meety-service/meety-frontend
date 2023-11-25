import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import GradationButton from "./GradationButton";
import PageTitle from "./PageTitle";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import useLoginCheck from "../hooks/useLoginCheck";
import { axiosWH } from "../utils/axios";
import { dateParser } from "../utils/dateParser";

const MeetingConfirmedPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [confirmedMeetingInfo, setConfirmedMeetingInfo] = useState([]);

  useLoginCheck();

  // 서버에서 확정된 미팅 날짜 조회
  useEffect(() => {
    const fetchData = async () => {
      await axiosWH
        .get(`/meetings/${id}/vote`)
        .then((response) => {
          if (response.data) {
            console.log(response);
            if (response.data.close == 1 && response.data.largest_choices) {
              setConfirmedMeetingInfo(response.data.largest_choices); // 확정된 미팅 날짜 저장
            } else {
              // TODO: 확정이 안 되었는데 미팅 확정 페이지로 이동한 경우 -> 예외 처리 필요
              console.log("[MeetingConfirmedPage.jsx] 확정된 미팅 날짜가 없습니다.")
            }
          } else {
            console.log(
              "[MeetingConfirmedPage.jsx] 서버에서 확정된 미팅 정보가 전달되지 않았습니다."
            );
          }
        })
        .catch(function (error) {
          if (error.response) {
            // 요청이 전송되었고, 서버가 2xx 외의 상태 코드로 응답한 경우
            console.log(error.response);
          } else if (error.request) {
            // 요청이 전송되었지만, 응답이 수신되지 않은 경우
            console.log(error.request);
          } else {
            // 오류가 발생한 요청을 설정하는 동안 문제가 발생한 경우
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
    };
    fetchData();
  }, []);

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
            <EventAvailableRoundedIcon style={{ fill: "#1B51DC" }} />
            <p className="font-extrabold text-md">미팅 날짜가 결정되었어요!</p>
          </div>
          <div className="space-y-4 w-full max-h-[50%] overflow-y-scroll py-2 px-5 mb-10 rounded-lg">
            {/*개별 옵션*/}
            {confirmedMeetingInfo.map((info) => (
              <div
                key={info.id}
                className="h-16 w-full md:w-2/5 flex flex-row items-center justify-center bg-gradient-to-r rounded-2xl shadow-md border-2 border-solid border-meety-component_outline_gray mx-auto"
              >
                <p className="text-lg font-extrabold">{dateParser(info.date, info.start_time, info.end_time)}</p>
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
