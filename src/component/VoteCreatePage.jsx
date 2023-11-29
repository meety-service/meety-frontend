import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
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
import useLoginCheck from "../hooks/useLoginCheck";
import { useErrorCheck } from "../hooks/useErrorCheck";
import { getSortedMeetingInfo } from "../utils/meetingSort";
import { calculateIntervals } from "./TimeSlot";
import { dateParser } from "../utils/dateParser";

const VoteCreatePage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  useLoginCheck();

  const [error, handleError] = useState(undefined);
  useErrorCheck(error);

  const [meetingForm, setMeetingForm] = useState({
    meeting_dates: [],
    start_time: "00:00:00",
    end_time: "00:00:00",
    timezone: "",
  });

  const [degrees, setDegrees] = useState([]);

  const [isMinHourDropdownShown, setMinHourDropdownShown] = useState(false);
  const [selectedMinCellCount, setSelectedMinCellCount] = useState(1);
  const [sortedSchedules, setSortedSchedules] = useState([]);
  const [sortedSchedulesForOption, setSortedSchedulesForOption] = useState([]);

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

  const [optionDate, setOptionDate] = useState("");
  const [optionStartTime, setOptionStartTime] = useState("");
  const [optionEndTime, setOptionEndTime] = useState("");

  const [voteOptions, setVoteOptions] = useState([]);

  const addDefaultVoteOption = () => {
    const newOption = {
      date: "2023-10-08",
      start_time: "16:00:00",
      end_time: "18:00:00",
    };

    if (
      voteOptions.some(
        (option) =>
          option.date === newOption.date &&
          option.start_time === newOption.start_time &&
          option.end_time === newOption.end_time
      )
    ) {
      return;
    }

    setVoteOptions((options) => [...options, newOption]);
  };

  const addVoteOption = () => {
    if (optionDate === "" || optionStartTime === "" || optionEndTime === "") {
      return;
    }

    const newOption = {
      date: optionDate,
      start_time: optionStartTime,
      end_time: optionEndTime,
    };

    if (
      voteOptions.some(
        (option) =>
          option.date === newOption.date &&
          option.start_time === newOption.start_time &&
          option.end_time === newOption.end_time
      )
    ) {
      return;
    }

    setVoteOptions((options) => [...options, newOption]);
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
      await getMeetingForm(id, handleError).then((data) => {
        setMeetingForm(data);
      });
      await getAllSchedules(id, handleError).then((data) => {
        setMembers(data.members);
        setSchedules(data.schedules);
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    setSortedSchedules(
      getSortedMeetingInfo(
        { members, schedules },
        meetingForm.start_time,
        meetingForm.end_time,
        selectedMinCellCount
      ).schedules
    );
    setSortedSchedulesForOption(
      getSortedMeetingInfo(
        { members, schedules },
        meetingForm.start_time,
        meetingForm.end_time,
        1
      ).schedules
    );
    setOptionDate(meetingForm.meeting_dates[0]?.available_date ?? "");
  }, [members, schedules, meetingForm, selectedMinCellCount]);

  useEffect(() => {
    const optionStartTimeList = getOptionStartTimeList(
      sortedSchedulesForOption,
      optionDate
    );
    setOptionStartTime(optionStartTimeList?.[0] ?? "");
  }, [sortedSchedulesForOption, optionDate]);

  useEffect(() => {
    const optionEndTimeList = getOptionEndTimeList(
      sortedSchedulesForOption,
      optionDate,
      optionStartTime
    );
    setOptionEndTime(optionEndTimeList?.[0] ?? "");
  }, [sortedSchedulesForOption, optionDate, optionStartTime]);

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
      <div className="ml-[16px] mt-[32px]">
        <PageTitle title="투표 폼 생성하기" />
      </div>
      <div className="ml-[20px] mt-[20px]">
        <StepTitle title="1. 모든 참여자의 미팅 가능 시간을 확인해보세요." />
      </div>
      <div className="mx-[36px] my-[12px]">
        <TimeSlot
          meetingForm={meetingForm}
          members={members}
          degrees={degrees}
        />
      </div>
      <div className="h-[20px]" />
      <div className="mx-[36px]">
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
              value={selectedMinCellCount}
              onChange={handleMinHourDropdown}
              className="text-[10px] font-[700]"
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
      <div className="flex w-full justify-center py-[40px]">
        <KeyboardDoubleArrowDownRoundedIcon />
      </div>
      <div className="ml-[20px]">
        <StepTitle title="2. 투표지를 만들어보세요." />
      </div>
      <div className="mt-[12px] mx-[36px]">
        <ListHeader title="투표 선택지를 추가해보세요." />
        <div className="border border-solid border-meety-component_outline_gray rounded-b-[10px] shadow-lg">
          <div className="flex justify-between p-[8px]">
            <div className="text-[14px] font-[700]">(1) 날짜를 입력하세요.</div>
            <select
              id="dropdown"
              value={optionDate}
              onChange={(event) => setOptionDate(event.target.value)}
              className="text-[14px] font-[700]"
            >
              {meetingForm.meeting_dates.map((meeting_date) => (
                <option
                  key={meeting_date.available_date}
                  value={meeting_date.available_date}
                >
                  {meeting_date.available_date}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between p-[8px]">
            <div className="text-[14px] font-[700]">
              (2) 시작 시간을 입력하세요.
            </div>
            <select
              id="dropdown"
              value={optionStartTime}
              onChange={(event) => setOptionStartTime(event.target.value)}
              className="text-[14px] font-[700]"
            >
              {getOptionStartTimeList(
                sortedSchedulesForOption,
                optionDate
              )?.map((time, index) => (
                <option key={index} value={time}>
                  {formatTime(time)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between p-[8px]">
            <div className="text-[14px] font-[700]">
              (3) 종료 시간을 입력하세요.
            </div>
            <select
              id="dropdown"
              value={optionEndTime}
              onChange={(event) => setOptionEndTime(event.target.value)}
              className="text-[14px] font-[700]"
            >
              {getOptionEndTimeList(
                sortedSchedulesForOption,
                optionDate,
                optionStartTime
              )?.map((time, index) => (
                <option key={index} value={time}>
                  {formatTime(time)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-center items-center h-[40px] bg-gradient-to-r from-meety-btn_light_blue to-meety-btn_dark_blue text-[16px] rounded-[10px] shadow-lg mx-[10px] mt-[20px] mb-[12px]">
            <button
              className="w-full h-full font-[700] text-white"
              onClick={addVoteOption}
            >
              추가하기
            </button>
          </div>
          <div className="flex justify-center items-center h-[40px] bg-gradient-to-r from-meety-btn_light_blue to-meety-btn_dark_blue text-[16px] rounded-[10px] shadow-lg m-[10px]">
            <button
              className="w-full h-full font-[700] text-white"
              onClick={addDefaultVoteOption}
            >
              기본값 추가하기 (테스트)
            </button>
          </div>
        </div>
      </div>
      <div className="mx-[36px] mt-[34px]">
        <ListHeader title="다음과 같이 투표를 진행합니다." />
        {voteOptions.map((option, index) => (
          <OptionListItem
            key={index}
            index={index}
            option={option}
            endComponent={
              <button
                className="text-meety-del_red"
                onClick={() => removeVoteOption(index)}
              >
                <RemoveCircleOutlineRoundedIcon />
              </button>
            }
          />
        ))}
      </div>
      <div className="flex w-full justify-center py-[40px]">
        <KeyboardDoubleArrowDownRoundedIcon />
      </div>
      <div className="ml-[20px] mt-[20px]">
        <StepTitle title="3. 투표를 생성할 준비가 되셨나요?" />
      </div>
      <div className="mx-[48px] mt-[8px]">
        <SubMessage title="'투표 폼 생성하기' 버튼을 클릭하면 다음 페이지에서 링크를 통해" />
        <SubMessage title="투표 폼을 다른 사람들에게 공유할 수 있습니다." />
      </div>
      <div className="pt-[20px] pb-[28px] px-[20px]">
        <GradationButton
          text="투표 폼 생성하기"
          onButtonClick={async () => {
            await createVoteForm(
              id,
              { vote_choices: groupByDate(voteOptions) },
              handleError
            );
            navigate(`/vote/fill/${id}`, { replace: true });
          }}
        />
      </div>
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

const getOptionStartTimeList = (sortedSchedules, optionDate) => {
  const result = [];

  sortedSchedules
    .find((schedule) => schedule.date === dateParser(optionDate))
    ?.cases.forEach((element) => {
      const [start, end] = element.time.split(" ~ ");
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);
      const s = Math.floor((sh * 60 + sm) / 15);
      const e = Math.floor((eh * 60 + em) / 15);

      Array(e - s)
        .fill()
        .forEach((_, index) => {
          const n = (s + index) * 15;
          const h = Math.floor(n / 60);
          const m = n % 60;
          const time = `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}:00`;
          result.push(time);
        });
    });

  return result;
};

const getOptionEndTimeList = (sortedSchedules, optionDate, optionStartTime) => {
  const time = sortedSchedules
    .find((schedule) => schedule.date === dateParser(optionDate))
    ?.cases.find((element) => {
      const [start, end] = element.time.split(" ~ ");
      return optionStartTime >= start + ":00" && optionStartTime < end + ":00";
    })?.time;

  if (time === undefined) {
    return [];
  }

  const [_, end] = time.split(" ~ ");
  const [sh, sm] = optionStartTime.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const s = Math.floor((sh * 60 + sm) / 15) + 1;
  const e = Math.floor((eh * 60 + em) / 15) + 1;

  return Array(e - s)
    .fill()
    .map((_, index) => {
      const n = (s + index) * 15;
      const h = Math.floor(n / 60);
      const m = n % 60;
      const time = `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}:00`;
      return time;
    })
    .filter((e) => e > optionStartTime);
};

export default VoteCreatePage;
