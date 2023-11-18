import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import { PageTitle, StepTitle, ListHeader, ScheduleList } from "./";
import { getAllSchedules } from "../utils/axios";

const VoteCreatePage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

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
      date: "2023-11-29",
      start_time: "10:00:00",
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
      await getAllSchedules(id).then((data) => {
        setMembers(data.members);
        setSchedules(data.schedules);
      });
    };
    fetchData();
  }, []);

  return (
    <div className="nav_top_padding mobile_h_fit">
      <PageTitle title="투표 폼 생성하기" />
      <StepTitle title="1. 모든 참여자의 미팅 가능 시간을 확인해보세요." />
      <div className="text-[12px] font-[700] text-right">
        표준시 (Time Zone)
      </div>
      <ListHeader title="가장 많이 겹치는 시간대는?" />
      <ScheduleList members={members} schedules={schedules} />
      <StepTitle title="2. 투표지를 만들어보세요." />
      <ListHeader title="투표 선택지를 추가해보세요." />
      <div className="text-[14px] font-[700]">
        (1) 날짜를 입력하세요. ||
        <input type="date" value={optionDate} onChange={changeDate} />
      </div>
      <div className="text-[14px] font-[700]">
        (2) 시작 시간을 입력하세요. ||
        <input type="time" value={optionStartTime} onChange={changeStart} />
      </div>
      <div className="text-[14px] font-[700]">
        (3) 종료 시간을 입력하세요. ||
        <input type="time" value={optionEndTime} onChange={changeEnd} />
      </div>
      <div className="bg-gradient-to-r from-meety-btn_light_blue to-meety-btn_dark_blue text-[16px] font-[700] text-white">
        <button onClick={addVoteOption}>추가하기</button>
      </div>
      <div>
        <button onClick={addDefaultVoteOption}>기본값 추가하기</button>
      </div>
      <ListHeader title="다음과 같이 투표를 진행합니다." />
      <ul>
        {voteOptions.map((option, index) => (
          <div key={index} className="flex justify-between">
            {index + 1} {formatOption(option)}
            <button onClick={() => removeVoteOption(index)}>
              <RemoveCircleOutlineRoundedIcon />
            </button>
          </div>
        ))}
      </ul>
      <StepTitle title="3. 투표를 생성할 준비가 되셨나요?" />
      <div>
        <button
          onClick={() => {
            navigate(`/vote/fill/${id}`, { replace: true });
          }}
        >
          투표 폼 생성하기
        </button>
      </div>
    </div>
  );
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
};

const formatOption = (option) => {
  return `${formatDate(option.date)} ${option.start_time} ~ ${option.end_time}`;
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
