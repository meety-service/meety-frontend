import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PageTitle,
  StepTitle,
  SubMessage,
  TimeSlot,
  GradationButton,
} from "./";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import useLoginCheck from "../hooks/useLoginCheck";
import { useErrorCheck } from "../hooks/useErrorCheck";
import {
  getMeetingInfo,
  getMeetingForm,
  submitSchedules,
  editSchedules,
  getMySchedules,
} from "../utils/axios";
import { timeToMinutes, calculateIntervals } from "./TimeSlot";

const MeetingFillPage2 = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  useLoginCheck();

  const [error, handleError] = useState(undefined);
  useErrorCheck(error);

  const [meetingInfo, setMeetingInfo] = useState({});

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

  const onSubmitButtonClick = async () => {
      const select_times = [];
      for (let i = 0; i < timeSlotSelected.length; i++) {
        const date = meetingForm.meeting_dates[i].available_date;

        const times = [];
        for (let j = 0; j < timeSlotSelected[i].length; j++) {
          if (timeSlotSelected[i][j] === true) {
            times.push({
              time: calculateTimeIn24hAfterIntervals(
                meetingForm.start_time,
                j
              ),
            });
          }
        }

        if (times.length > 0) {
          select_times.push({ date, times });
        }
      }

      if (meetingInfo.user_state === 0) {
        await submitSchedules(
          id,
          { nickname, select_times },
          handleError
        );
      } else if (meetingInfo.user_state === 1) {
        await editSchedules(
          id,
          { nickname, select_times },
          handleError
        );
      } else {
        throw new Error("unexpected user_state");
      }

      navigate(`/meeting/view/${id}`, { replace: true });
  }
  

  useEffect(() => {
    const fetchData = async () => {
      await getMeetingInfo(id, handleError).then((data) => {
        setMeetingInfo(data.find((meeting) => meeting.id === parseInt(id)));
      });
      await getMeetingForm(id, handleError).then((data) => {
        setMeetingForm(data);
      });
      await getMySchedules(id, handleError, true).then((data) => {
        if (data) {
          setNickName(data.nickname);
          setSelectedTimes(data.select_times);
        }
      });
    };
    fetchData();
  }, []);

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

  return (
    <div className="nav_top_padding mobile-h-fit bg-white w-full h-fit">
      <div className="relative flex flex-col justify-center items-center w-full h-full">
        <div className="relative w-full h-full flex flex-col justify-center items-center mt-4 px-5 pb-10">
          <div className="relative flex flex-col justify-center space-y-2 w-full md:w-2/5 h-fit py-2 px-2 rounded-xl">
            <button
              className="absolute top-0 right-0 mt-0 text-[14px] text-right underline"
              onClick={async () =>
                await navigator.clipboard.writeText(window.location.href)
              }
            >
              <p>링크 복사하기</p>
            </button>
            <div className="w-full pb-4">
              <PageTitle title="미팅 폼 작성하기" />
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
              />
            </div>

            <div className="h-20 flex flex-col justify-center items-center">
              <KeyboardDoubleArrowDownRoundedIcon style={{ fill: "#BFBCC6" }} />
            </div>

            <StepTitle title="2. 미팅이 가능한 시간을 모두 선택해주세요." />
            <TimeSlot
              meetingForm={meetingForm}
              members={1}
              degrees={degrees}
              isSelectable={true}
              setSelectedParent={setTimeSlotSelected}
            />

            <div className="h-20 flex flex-col justify-center items-center">
              <KeyboardDoubleArrowDownRoundedIcon style={{ fill: "#BFBCC6" }} />
            </div>

            <div className="relative flex flex-col justify-center space-y-2 w-full h-fit py-2 px-2 pb-6">
            <StepTitle title="3. 미팅폼 작성이 모두 끝나셨나요?" />
            <SubMessage title="아래의 '제출하기' 버튼을 클릭하여 다른 사람들에게 내 미팅 가능 시간을 공유하고" />
            <SubMessage title="다른 사람들의 미팅 가능 시간을 확인할 수 있습니다." />
            </div>

            <GradationButton
              text="제출하기"
              onButtonClick={onSubmitButtonClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const calculateTimeIn24hAfterIntervals = (startTime, intervals) => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + intervals * 15;
  let hours = Math.floor(endMinutes / 60);
  const minutes = endMinutes % 60;
  return `${hours < 10 ? "0" : ""}${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes}:00`;
};

export default MeetingFillPage2;
