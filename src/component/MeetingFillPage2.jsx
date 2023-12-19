import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PageTitle,
  StepTitle,
  SubMessage,
  TimeSlot,
  GradationButton,
  StandbyView,
} from "./";
import useLoginCheck from "../hooks/useLoginCheck";
import { useErrorCheck } from "../hooks/useErrorCheck";
import {
  getMeetingInfo,
  getMeetingForm,
  submitSchedules,
  editSchedules,
  getMySchedules,
  getUserState,
} from "../utils/axios";
import { timeToMinutes, calculateIntervals } from "./TimeSlot";
import { useRecoilCallback } from "recoil";
import {
  errorContentAtom,
  errorTitleAtom,
  isSnackbarOpenAtom,
  snackbarMessageAtom,
} from "../store/atoms";
import FollowLineArea from "./FollowLineArea";
import LinkButton from "./LinkButton";
import {
  AFTER_MEETING_FILL,
  BEFORE_MEETING_FILL,
  INVALID_ACCESS,
  INVALID_STATE,
} from "../utils/constants";
import { getNavigationUrl } from "../utils/getNavigationUrl";

const MeetingFillPage2 = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [error, handleError] = useState(undefined);
  const [meetingInfo, setMeetingInfo] = useState({});
  const [title, setTitle] = useState("");
  const [meetingForm, setMeetingForm] = useState({
    meeting_dates: [],
    start_time: "00:00:00",
    end_time: "00:00:00",
    timezone: "",
  });
  const [nickname, setNickName] = useState("");
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [timeSlotSelected, setTimeSlotSelected] = useState([]);

  const [isValidPage, setValidPage] = useState(false); // 사용자가 이동한 페이지가 맞는 페이지인지 확인

  // 페이지 기본 체크 항목
  useLoginCheck();
  useErrorCheck(error);

  const setErrorTitle = useRecoilCallback(({ set }) => (title) => {
    set(errorTitleAtom, title);
  });

  const setErrorContent = useRecoilCallback(({ set }) => (content) => {
    set(errorContentAtom, content);
  });

  const openSnackbar = useRecoilCallback(({ set }) => () => {
    set(isSnackbarOpenAtom, true);
  });

  const setSnackbarText = useRecoilCallback(({ set }) => (message) => {
    set(snackbarMessageAtom, message);
  });

  const onSubmitButtonClick = async () => {
    const select_times = [];
    for (let i = 0; i < timeSlotSelected.length; i++) {
      const date = meetingForm.meeting_dates[i].available_date;

      const times = [];
      for (let j = 0; j < timeSlotSelected[i].length; j++) {
        if (timeSlotSelected[i][j] === true) {
          times.push({
            time: calculateTimeIn24hAfterIntervals(meetingForm.start_time, j),
          });
        }
      }

      if (times.length > 0) {
        select_times.push({ date, times });
      }
    }

    if (meetingInfo === undefined || meetingInfo.user_state === 0) {
      await submitSchedules(id, { nickname, select_times }, handleError);
    } else if (meetingInfo.user_state === 1) {
      await editSchedules(id, { nickname, select_times }, handleError);
    } else {
      throw new Error("unexpected user_state");
    }

    navigate(`/meeting/view/${id}`, { replace: true });
  };

  useEffect(() => {
    // State 검사
    const checkState = async () => {
      let userState = await getUserState(id, handleError); // 사용자의 최신 State를 가져온다.
      console.log(`current page : meeting-fill / current state : ${userState}`);
      if (userState == INVALID_STATE) {
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

    // 데이터 fetch
    const fetchData = async () => {
      await getMeetingInfo(id, handleError).then((data) => {
        setMeetingInfo(data);
      });
      await getMeetingForm(id, handleError).then((data) => {
        setTitle(data.title);
        setMeetingForm(data);
      });
      await getMySchedules(id, handleError, true).then((data) => {
        if (data) {
          setNickName(data.nickname);
          setSelectedTimes(data.select_times);
        }
      });
    };
    // 페이지가 유효할 때 데이터를 읽어온다.
    if (isValidPage) {
      fetchData();
      window.scrollTo(0, 0); // 페이지 최상단으로 이동
    }
  }, [isValidPage]);

  useEffect(() => {
    const { meeting_dates, start_time, end_time } = meetingForm;
    const intervals = calculateIntervals(start_time, end_time);
    const newDegrees = Array.from({ length: meeting_dates.length }, () =>
      Array.from({ length: intervals }, () => 0)
    );
    selectedTimes.forEach((selectedTime) => {
      const i = meeting_dates.findIndex(
        (meeting_date) => meeting_date.available_date === selectedTime.date
      );
      if (i === -1) {
        return;
      }

      selectedTime.times.forEach((time) => {
        const j = calculateIntervals(start_time, time.time);
        if (j === intervals) {
          return;
        }

        newDegrees[i][j] = 1;
      });
    });
    setDegrees(newDegrees);
  }, [meetingForm, selectedTimes]);

  return !isValidPage ? (
    <StandbyView />
  ) : (
    <div className="nav_top_padding mobile-h-fit bg-white w-full h-fit">
      <div className="relative flex flex-col justify-center items-center w-full h-full">
        <div className="relative w-full h-full flex flex-col justify-center items-center mt-4 px-5 pb-10">
          <div className="relative flex flex-col justify-center w-full md:w-2/5 h-fit py-2 px-2 rounded-xl">
            <div className="absolute top-0 right-0 h-fit z-10">
              <LinkButton />
            </div>
            <div className="relative flex flex-col justify-center space-y-2 w-full h-full">
              <div className="w-full">
                <PageTitle title="미팅 폼 작성하기" />
              </div>
              <div className="w-full pb-6 text-[15px] font-[700] text-meety-exp_text_gray">
                (미팅 이름: {title})
              </div>
              <StepTitle
                title="1. 다른 사람에게 보여질 이름을 적어주세요."
                className="left-0 top-0"
              />
              <div className="bg-gradient-to-r from-meety-btn_light_blue to-meety-btn_dark_blue p-1 rounded-full">
                <input
                  type="text"
                  placeholder="ex) 홍길동"
                  value={nickname}
                  onChange={(event) => setNickName(event.target.value)}
                  className="pl-3 h-12 w-full rounded-full"
                  style={{ outline: "none" }}
                />
              </div>

              <FollowLineArea />

              <StepTitle title="2. 미팅이 가능한 시간을 모두 선택해주세요." />
              <TimeSlot
                meetingForm={meetingForm}
                members={1}
                degrees={degrees}
                isSelectable={true}
                setSelectedParent={setTimeSlotSelected}
              />

              <FollowLineArea />

              <div className="relative flex flex-col justify-center space-y-2 w-full h-fit py-2 px-2 pb-6">
                <StepTitle title="3. 미팅폼 작성이 모두 끝나셨나요?" />
                <SubMessage title="아래의 '제출하기' 버튼을 클릭하여 다른 사람들에게 내 미팅 가능 시간을 공유하고 다른 사람들의 미팅 가능 시간을 확인할 수 있습니다." />
              </div>

              <GradationButton
                text="제출하기"
                onButtonClick={onSubmitButtonClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const calculateTimeIn24hAfterIntervals = (startTime, intervals) => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + intervals * 15;
  let hours = Math.floor(endMinutes / 60);
  const minutes = endMinutes % 60;
  return `${hours < 10 ? "0" : ""}${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes}:00`;
};

export default MeetingFillPage2;
