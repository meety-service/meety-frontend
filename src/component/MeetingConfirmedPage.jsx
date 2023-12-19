import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import GradationButton from "./GradationButton";
import PageTitle from "./PageTitle";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import useLoginCheck from "../hooks/useLoginCheck";
import { axiosWH, getUserState } from "../utils/axios";
import { dateParser } from "../utils/dateParser";
import { useErrorCheck } from "../hooks/useErrorCheck";
import { INVALID_STATE, MEETING_CONFIRMED } from "../utils/constants";
import { useRecoilCallback } from "recoil";
import { errorContentAtom, errorTitleAtom } from "../store/atoms";
import StandbyView from "./StandbyView";

const MeetingConfirmedPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [confirmedMeetingInfo, setConfirmedMeetingInfo] = useState([]);
  const [error, handleError] = useState(undefined);
  const [isValidPage, setValidPage] = useState(false); // 사용자가 이동한 페이지가 유효한 페이지인지 확인

  // 페이지 기본 체크 항목
  useLoginCheck();
  useErrorCheck(error);

  const setErrorTitle = useRecoilCallback(({ set }) => (title) => {
    set(errorTitleAtom, title);
  });

  const setErrorContent = useRecoilCallback(({ set }) => (content) => {
    set(errorContentAtom, content);
  });

  // 서버에서 확정된 미팅 날짜 조회
  useEffect(() => {
    // State 검사
    const checkState = async () => {
      let userState = await getUserState(id, handleError); // 사용자의 최신 State를 가져온다.
      console.log(`current page : meeting-view / current state : ${userState}`);
      if (userState != MEETING_CONFIRMED) {
        setErrorTitle("원하시는 페이지를 찾을 수 없습니다.");
        setErrorContent(
          "찾으시려는 페이지의 주소가 잘못 입력되었거나, 페이지 주소의 변경 혹은 삭제로 인해 현재 사용하실 수 없습니다."
        );
        navigate("/error");
      } else {
        setValidPage(true);
      }
    };
    checkState();

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
              console.log(
                "[MeetingConfirmedPage.jsx] 확정된 미팅 날짜가 없습니다."
              );
            }
          } else {
            console.log(
              "[MeetingConfirmedPage.jsx] 서버에서 확정된 미팅 정보가 전달되지 않았습니다."
            );
          }
        })
        .catch(function (error) {
          handleError(error);
        });
    };
    // 페이지가 유효할 때 데이터를 읽어온다.
    if (isValidPage) {
      fetchData();
      window.scrollTo(0, 0); // 페이지 최상단으로 이동
    }
  }, [isValidPage]);

  return !isValidPage ? (
    <StandbyView />
  ) : (
    <div className="nav_top_padding mobile-h-fit bg-white w-full h-screen">
      <div className="relative flex flex-col justify-center items-center w-full h-full">
        <div className="relative w-full h-full flex flex-col justify-center items-center px-5 pb-10">
          <div className="relative flex flex-col justify-center space-y-2 w-full h-full md:w-2/5 py-2 rounded-xl">
            <div className="absolute top-4 w-full pb-4 mt-2">
              <PageTitle title="미팅 확정" />
            </div>
            {/*옵션 스크롤*/}
            <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="w-full flex flex-row items-center space-x-2 pl-5 md:pl-1 mb-2">
                <EventAvailableRoundedIcon style={{ fill: "#1B51DC" }} />
                <p className="font-extrabold text-md">
                  미팅 날짜가 결정되었어요!
                </p>
              </div>
              <div className="space-y-4 w-full max h-fit py-2 px-5 mb-10 rounded-lg">
                {/*개별 옵션*/}
                {confirmedMeetingInfo.map((info) => (
                  <div
                    key={info.id}
                    className="h-16 w-full flex flex-row items-center justify-center bg-gradient-to-r rounded-2xl shadow-md border-2 border-solid border-meety-component_outline_gray mx-auto"
                  >
                    <p className="text-lg font-extrabold">
                      {dateParser(info.date, info.start_time, info.end_time)}
                    </p>
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
      </div>
    </div>
  );
};

export default MeetingConfirmedPage;
