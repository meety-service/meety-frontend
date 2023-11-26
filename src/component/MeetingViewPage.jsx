import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import axios from "axios";
import { axiosWH } from "../utils/axios";
import useLoginCheck from "../hooks/useLoginCheck";
import { useErrorCheck } from "../hooks/useErrorCheck";
import { handleError } from "../utils/handleError";
import {
  PageTitle,
  StepTitle,
  SubMessage,
  TimeSlot,
  ListHeader,
  ScheduleList,
  OptionListItem,
  GradationButton,
} from "./";
import {
  createVoteForm,
  getAllSchedules,
  getMeetingForm,
} from "../utils/axios";
import { getSortedMeetingInfo } from "../utils/meetingSort";
import { calculateIntervals } from "./TimeSlot";

const MeetingViewPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  useLoginCheck();

  const [timezone, setTimezone] = useState("");

  const [meetingForm, setMeetingForm] = useState({
    meeting_dates: [],
    start_time: "00:00:00",
    end_time: "00:00:00",
    timezone: "",
  });

  const [degrees, setDegrees] = useState([]);

  const [isMinHourDropdownShown, setMinHourDropdownShown] = useState(false);
  const [selectedMinHour, setSelectedMinHour] = useState(1);
  const [sortedSchedules, setSortedSchedules] = useState([]);

  const handleMinHourDropdown = (event) => {
    setSelectedMinHour(event.target.value);
    setSortedSchedules(
      getSortedMeetingInfo(
        { members, schedules },
        meetingForm.start_time,
        meetingForm.end_time,
        selectedMinHour
      ).schedules
    );
  };

  const [optionDate, setOptionDate] = useState("");

  const changeDate = (event) => {
    setOptionDate(event.target.value);
  };

  const [optionStartTime, setOptionStartTime] = useState("");

  const changeStart = (event) => {
    setOptionStartTime(event.target.value);
  };

  const [optionEndTime, setOptionEndTime] = useState("");

  const changeEnd = (event) => {
    setOptionEndTime(event.target.value);
  };

  const [voteOptions, setVoteOptions] = useState([]);

  const addDefaultVoteOption = () => {
    const newOption = {
      date: "2023-10-08",
      start_time: "16:00:00",
      end_time: "18:00:00",
    };
    setVoteOptions((options) => [...options, newOption]);
  };

  const addVoteOption = () => {
    if (optionDate === "" || optionStartTime === "" || optionEndTime === "") {
      return;
    } else if (optionStartTime >= optionEndTime) {
      alert("시작 시간이 종료 시간보다 늦습니다.");
      return;
    }

    const newOption = {
      date: optionDate,
      start_time: optionStartTime + ":00",
      end_time: optionEndTime + ":00",
    };
    setVoteOptions((options) => [...options, newOption]);
    setOptionDate("");
    setOptionStartTime("");
    setOptionEndTime("");
  };

  const removeVoteOption = (index) => {
    setVoteOptions((options) => [
      ...options.slice(0, index),
      ...options.slice(index + 1),
    ]);
  };

  const [members, setMembers] = useState(0);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await getMeetingForm(id).then((data) => {
        setMeetingForm(data);
      });
      await getAllSchedules(id).then((data) => {
        setMembers(data.members);
        setSchedules(data.schedules);
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (
      meetingForm.start_time &&
      meetingForm.end_time &&
      members &&
      schedules
    ) {
      setSortedSchedules(
        getSortedMeetingInfo(
          { members, schedules },
          meetingForm.start_time,
          meetingForm.end_time,
          selectedMinHour
        ).schedules
      );
    }
  }, [meetingForm.start_time, meetingForm.end_time, members, schedules]);

  useEffect(() => {
    const fetchData = async () => {
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
    };
    fetchData();
  }, [meetingForm, schedules]);

  return (
    <div className="nav_top_padding mobile_h_fit">
      <div className="ml-4 mt-8">
        <PageTitle title="미팅 폼 작성 완료" />
      </div>
      <div className="ml-6 mt-4">
        <StepTitle title="1. 모든 참여자의 미팅 가능 시간을 확인해보세요." />
      </div>
      <div className="text-[12px] font-[700] text-right">
        표준시(Time Zone) {timezone}
      </div>
      {meetingForm.start_time && meetingForm.end_time && (
        <TimeSlot
          meetingForm={meetingForm}
          members={members}
          degrees={degrees}
        />
      )}
      <div className="mx-[20px]">
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
          <div className="flex w-full h-[40px] justify-between items-center border-x border-b border-solid border-meety-component_outline_gray p-[6px]">
            <div className="text-[11px] font-[700]">
              적어도 몇 시간 이상 모여야 하나요?
            </div>
            <select
              id="dropdown"
              value={selectedMinHour}
              onChange={handleMinHourDropdown}
              className="text-[10px] font-[700]"
            >
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
                  <option key={index} value={index + 1}>
                    {index + 1} 시간
                  </option>
                ))}
            </select>
          </div>
        )}
        <ScheduleList schedules={sortedSchedules} />
      </div>
      <div className="flex w-full justify-center py-[40px]">
        <KeyboardDoubleArrowDownRoundedIcon />
      </div>
      <div className="ml-6">
        <StepTitle title="2. 혹시 수정할 내용이 있으신가요?" />
      </div>
      <SubMessage title="아래의 '수정하기'버튼을 클릭하여 이전에 작성했던 미팅 폼을 수정할 수 있습니다." />

      <div className="h-[20px]" />
      <GradationButton
        text="수정하기"
        onButtonClick={async () => {
          await createVoteForm(id, { vote_choices: groupByDate(voteOptions) });
          navigate(`/meeting/fill/${id}`, { replace: true });
        }}
      />
      <div className="h-[40px]" />

      <div className="ml-6">
        <StepTitle title="3.투표를 진행할까요?" />
      </div>
      <SubMessage
        title="아래의 ‘투표 진행하기’ 버튼을 클릭하여 미팅 폼 작성을 마감하고,
최종 미팅 일자 결정을 위한 투표 폼을 생성할 수 있습니다."
      />

      <div className="h-[20px]" />
      <GradationButton
        text="투표 진행하기"
        onButtonClick={async () => {
          await createVoteForm(id, { vote_choices: groupByDate(voteOptions) });
          navigate(`/vote/create/${id}`, { replace: true });
        }}
      />
      <div className="h-[40px]" />
    </div>
  );
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
};

export const formatTime = (timeString) => {
  return timeString.replace(/^(\d{2}:\d{2}):\d{2}$/, "$1");
};

export const formatOption = (option) => {
  return (
    formatDate(option.date) +
    " " +
    formatTime(option.start_time) +
    " ~ " +
    formatTime(option.end_time)
  );
};

const groupByDate = (flattenedArray) => {
  return flattenedArray.reduce((result, element) => {
    const foundGroup = result.find((group) => group.date === element.date);

    if (foundGroup) {
      foundGroup.times.push({
        start_time: element.start_time,
        end_time: element.end_time,
      });
    } else {
      result.push({
        date: element.date,
        times: [{ start_time: element.start_time, end_time: element.end_time }],
      });
    }

    return result;
  }, []);
};

const flattenWithDate = (groupedArray) => {
  return groupedArray.reduce((result, element) => {
    element.times.forEach((time) => {
      result.push({
        date: element.date,
        start_time: time.start_time,
        end_time: time.end_time,
      });
    });

    return result;
  }, []);
};

export default MeetingViewPage;
