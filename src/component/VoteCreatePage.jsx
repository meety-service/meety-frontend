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
import { getAllSchedules, getMeetingForm } from "../utils/axios";

const VoteCreatePage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [meetingForm, setMeetingForm] = useState({
    available_dates: [],
    start_time: "00:00:00",
    end_time: "00:00:00",
    timezone: "",
  });

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

  return (
    <div className="nav_top_padding mobile_h_fit">
      <div className="ml-4 mt-8">
        <PageTitle title="투표 폼 생성하기" />
      </div>
      <div className="ml-6 mt-4">
        <StepTitle title="1. 모든 참여자의 미팅 가능 시간을 확인해보세요." />
      </div>
      <TimeSlot
        meetingForm={meetingForm}
        members={members}
        schedules={schedules}
      />
      <div className="mx-[20px]">
        <ListHeader
          title="가장 많이 겹치는 시간대는?"
          endComponent={
            <button className="text-white" onClick={() => {}}>
              <TuneRoundedIcon />
            </button>
          }
        />
        <ScheduleList members={members} schedules={schedules} />
      </div>
      <div className="flex w-full justify-center py-[40px]">
        <KeyboardDoubleArrowDownRoundedIcon />
      </div>
      <div className="ml-6">
        <StepTitle title="2. 투표지를 만들어보세요." />
      </div>
      <div className="m-[20px]">
        <ListHeader title="투표 선택지를 추가해보세요." />
        <div className="border border-solid border-meety-component_outline_gray rounded-b-[10px] shadow-lg">
          <div className="flex justify-between px-[8px] py-[4px]">
            <div className="text-[14px] font-[700]">(1) 날짜를 입력하세요.</div>
            <input type="date" value={optionDate} onChange={changeDate} />
          </div>
          <div className="flex justify-between px-[8px] py-[4px]">
            <div className="text-[14px] font-[700]">
              (2) 시작 시간을 입력하세요.
            </div>
            <input type="time" value={optionStartTime} onChange={changeStart} />
          </div>
          <div className="flex justify-between px-[8px] py-[4px]">
            <div className="text-[14px] font-[700]">
              (3) 종료 시간을 입력하세요.
            </div>
            <input type="time" value={optionEndTime} onChange={changeEnd} />
          </div>
          <div className="flex justify-center items-center h-[40px] bg-gradient-to-r from-meety-btn_light_blue to-meety-btn_dark_blue text-[16px] rounded-[10px] shadow-lg m-[10px]">
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
      <div className="mx-[20px]">
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
      <StepTitle title="3. 투표를 생성할 준비가 되셨나요?" />
      <div className="px-[40px]">
        <SubMessage title="'투표 폼 생성하기' 버튼을 클릭하면 다음 페이지에서 링크를 통해" />
        <SubMessage title="투표 폼을 다른 사람들에게 공유할 수 있습니다." />
      </div>
      <div className="h-[20px]" />
      <GradationButton
        text="투표 폼 생성하기"
        onButtonClick={() => {
          navigate(`/vote/fill/${id}`, { replace: true });
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

export default VoteCreatePage;
