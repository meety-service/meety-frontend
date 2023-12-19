import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import useLoginCheck from "../hooks/useLoginCheck";
import { useErrorCheck } from "../hooks/useErrorCheck";
import {
  PageTitle,
  StepTitle,
  SubMessage,
  TimeSlot,
  ListHeader,
  ScheduleList,
  GradationButton,
  StandbyView,
} from "./";
import {
  getAllSchedules,
  getMeetingForm,
  getMeetingInfo,
  getUserState,
} from "../utils/axios";
import { calculateIntervals } from "./TimeSlot";
import { getSortedMeetingInfo } from "../utils/meetingSort";
import { useRecoilCallback } from "recoil";
import {
  errorContentAtom,
  errorTitleAtom,
  isSnackbarOpenAtom,
  snackbarMessageAtom,
} from "../store/atoms";
import FollowLineArea from "./FollowLineArea";
import { AFTER_MEETING_FILL, INVALID_STATE } from "../utils/constants";
import { getNavigationUrl } from "../utils/getNavigationUrl";

const MeetingViewPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [meetingForm, setMeetingForm] = useState({
    meeting_dates: [],
    start_time: "00:00:00",
    end_time: "00:00:00",
    timezone: "",
  });

  const [degrees, setDegrees] = useState([]);

  const [members, setMembers] = useState(0);
  const [schedules, setSchedules] = useState([]);

  const [isMinHourDropdownShown, setMinHourDropdownShown] = useState(false);
  const [selectedMinCellCount, setSelectedMinCellCount] = useState(1);
  const [sortedSchedules, setSortedSchedules] = useState([]);

  const [error, handleError] = useState(undefined);
  const [meetingInfo, setMeetingInfo] = useState({});

  const [isValidPage, setValidPage] = useState(false); // 사용자가 이동한 페이지가 맞는 페이지인지 확인

  // 페이지 기본 체크 항목
  useLoginCheck();
  useErrorCheck(error);

  const openSnackbar = useRecoilCallback(({ set }) => () => {
    set(isSnackbarOpenAtom, true);
  });

  const setSnackbarText = useRecoilCallback(({ set }) => (message) => {
    set(snackbarMessageAtom, message);
  });

  const setErrorTitle = useRecoilCallback(({ set }) => (title) => {
    set(errorTitleAtom, title);
  });

  const setErrorContent = useRecoilCallback(({ set }) => (content) => {
    set(errorContentAtom, content);
  });

  const handleMinHourDropdown = (event) => {
    setSelectedMinCellCount(event.target.value);
    setSortedSchedules(
      getSortedMeetingInfo(
        { members, schedules },
        meetingForm.start_time,
        meetingForm.end_time,
        event.target.value
      ).schedules
    );
  };

  useEffect(() => {
    // State 검사
    const checkState = async () => {
      let userState = await getUserState(id, handleError); // 사용자의 최신 State를 가져온다.
      console.log(`current page : meeting-view / current state : ${userState}`);
      if (userState == INVALID_STATE || userState < AFTER_MEETING_FILL) {
        setErrorTitle("원하시는 페이지를 찾을 수 없습니다.");
        setErrorContent(
          "찾으시려는 페이지의 주소가 잘못 입력되었거나, 페이지 주소의 변경 혹은 삭제로 인해 현재 사용하실 수 없습니다."
        );
        navigate("/error");
      } else if (userState > AFTER_MEETING_FILL) {
        // 투표 폼 생성 이후 시점에 다시 미팅 폼 작성 페이지로 이동한 경우
        const url = getNavigationUrl(id, userState);
        navigate(url);
      } else {
        setValidPage(true);
      }
    };
    checkState();

    const fetchData = async () => {
      await getMeetingInfo(id, handleError).then((data) => {
        setMeetingInfo(data);
      });
      await getMeetingForm(id, handleError).then((data) => {
        setMeetingForm(data);
      });
      await getAllSchedules(id, handleError).then((data) => {
        setMembers(data.members);
        setSchedules(data.schedules);
      });
    };
    // 페이지가 유효할 때 데이터를 읽어온다.
    if (isValidPage) {
      fetchData();
      window.scrollTo(0, 0); // 페이지 최상단으로 이동
    }
  }, []);

  useEffect(() => {
    const { meeting_dates, start_time, end_time } = meetingForm;
    const intervals = calculateIntervals(start_time, end_time);
    const newDegrees = Array.from({ length: meeting_dates.length }, () =>
      Array.from({ length: intervals }, () => 0)
    );
    schedules.forEach((schedule) => {
      const i = meeting_dates.findIndex(
        (meeting_date) => meeting_date.available_date === schedule.date
      );
      if (i === -1) {
        return;
      }

      schedule.times.forEach((time) => {
        const j = calculateIntervals(start_time, time.time);
        if (j == intervals) {
          return;
        }

        newDegrees[i][j] += time.available.length;
      });
    });
    setDegrees(newDegrees);
  }, [meetingForm, schedules]);

  useEffect(() => {
    setSortedSchedules(
      getSortedMeetingInfo(
        { members, schedules },
        meetingForm.start_time,
        meetingForm.end_time,
        selectedMinCellCount
      ).schedules
    );
  }, [members, schedules, meetingForm, selectedMinCellCount]);

  return !isValidPage ? (
    <StandbyView />
  ) : (
    <div className="nav_top_padding mobile-h-fit bg-white w-full h-fit">
      <div className="relative flex flex-col justify-center items-center w-full h-full">
        <div className="relative w-full h-full flex flex-col justify-center items-center mt-4 px-5 pb-10">
          <div className="relative flex flex-col justify-center space-y-2 w-full md:w-2/5 h-fit py-2 px-2 rounded-xl">
            <div className="w-full pb-6">
              <PageTitle title="미팅 폼 작성 완료" />
            </div>
            <StepTitle title="1. 모든 참여자의 미팅 가능 시간을 확인해보세요." />

            <TimeSlot
              meetingForm={meetingForm}
              members={members}
              degrees={degrees}
            />
            <div className="mt-3 shadow-md shadow-stone-400 rounded-t-[10px]">
              <ListHeader
                title="가장 많이 겹치는 시간대는?"
                endComponent={
                  <button
                    className="text-white"
                    onClick={() => {
                      setMinHourDropdownShown((prev) => !prev);
                    }}
                  >
                    <TuneRoundedIcon />
                  </button>
                }
              />
              {isMinHourDropdownShown && (
                <div className="flex w-full h-[40px] justify-between items-center border-solid border-x-[1.5px] border-b-[2px] border-meety-component_outline_gray p-[6px] text-meety-text_dark_gray">
                  <div className="text-xs font-bold pl-1">
                    적어도 몇 시간 이상 모여야 하나요?
                  </div>
                  <select
                    id="dropdown"
                    value={selectedMinCellCount}
                    onChange={handleMinHourDropdown}
                    className="text-xs font-bold"
                  >
                    <option value={1}>15분</option>
                    <option value={2}>30분</option>
                    {Array(
                      Math.floor(
                        calculateIntervals(
                          meetingForm.start_time,
                          meetingForm.end_time
                        ) / 4
                      )
                    )
                      .fill()
                      .map((_, index) => (
                        <option key={index} value={4 * (index + 1)}>
                          {index + 1}시간
                        </option>
                      ))}
                  </select>
                </div>
              )}
              <ScheduleList schedules={sortedSchedules} />
            </div>

            <FollowLineArea />

            <div className="relative flex flex-col justify-center space-y-2 w-full h-fit py-2 pb-6">
              <StepTitle title="2. 혹시 수정할 내용이 있으신가요?" />
              <SubMessage title="아래의 '수정하기'버튼을 클릭하여 이전에 작성했던 미팅 폼을 수정할 수 있습니다." />
            </div>

            <GradationButton
              text="수정하기"
              onButtonClick={() => navigate(`/meeting/fill/${id}`)}
            />
            {meetingInfo.isMaster == 1 && (
              <div>
                <FollowLineArea />

                <div className="relative flex flex-col justify-center space-y-2 w-full h-fit py-2 pb-6">
                  <StepTitle title="3.투표를 진행할까요?" />
                  <SubMessage title="아래의 '투표 진행하기 버튼을 클릭하여 미팅 폼 작성을 마감하고, 최종 미팅 일자 결정을 위한 투표 폼을 생성할 수 있습니다." />
                </div>

                <GradationButton
                  text="투표 진행하기"
                  onButtonClick={() => {
                    if (schedules.length === 0) {
                      setSnackbarText("작성된 미팅 폼이 없습니다.");
                      openSnackbar();
                    } else {
                      navigate(`/vote/create/${id}`);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingViewPage;
