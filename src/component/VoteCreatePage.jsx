import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import { PageTitle, StepTitle, ListHeader } from "./";

const VoteCreatePage = () => {
  const { id } = useParams();

  const [optionDate, setOptionDate] = useState("");

  const changeDate = (event) => {
    setOptionDate(event.target.value);
  };

  const [optionStart, setOptionStart] = useState("");

  const changeStart = (event) => {
    setOptionStart(event.target.value);
  };

  const [optionEnd, setOptionEnd] = useState("");

  const changeEnd = (event) => {
    setOptionEnd(event.target.value);
  };

  const [voteOptions, setVoteOptions] = useState([]);

  const addDefaultVoteOption = () => {
    const newOption = {
      date: "2021-12-31",
      start: "00:00",
      end: "00:00",
    };
    setVoteOptions((options) => [...options, newOption]);
  };

  const addVoteOption = () => {
    if (optionDate === "" || optionStart === "" || optionEnd === "") {
      return;
    } else if (optionStart >= optionEnd) {
      alert("시작 시간이 종료 시간보다 늦습니다.");
      return;
    }

    const newOption = {
      date: optionDate,
      start: optionStart,
      end: optionEnd,
    };
    setVoteOptions((options) => [...options, newOption]);
    setOptionDate("");
    setOptionStart("");
    setOptionEnd("");
  };

  const removeVoteOption = (index) => {
    setVoteOptions((options) => [
      ...options.slice(0, index),
      ...options.slice(index + 1),
    ]);
  };

  return (
    <div className="nav_top_padding mobile_h_fit p-[14px]">
      <PageTitle title="투표 폼 생성하기" />
      <StepTitle title="1. 모든 참여자의 미팅 가능 시간을 확인해보세요." />
      <div className="text-[12px] font-[700] text-right">
        표준시 (Time Zone)
      </div>
      <ListHeader title="가장 많이 겹치는 시간대는?" />
      <StepTitle title="2. 투표지를 만들어보세요." />
      <ListHeader title="투표 선택지를 추가해보세요." />
      <div className="text-[14px] font-[700]">
        (1) 날짜를 입력하세요. ||
        <input type="date" value={optionDate} onChange={changeDate} />
      </div>
      <div className="text-[14px] font-[700]">
        (2) 시작 시간을 입력하세요. ||
        <input type="time" value={optionStart} onChange={changeStart} />
      </div>
      <div className="text-[14px] font-[700]">
        (3) 종료 시간을 입력하세요. ||
        <input type="time" value={optionEnd} onChange={changeEnd} />
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
            {index + 1} {formatDate(option.date)} {option.start} ~ {option.end}
            <button onClick={() => removeVoteOption(index)}>
              <RemoveCircleOutlineRoundedIcon />
            </button>
          </div>
        ))}
      </ul>
      <StepTitle title="3. 투표를 생성할 준비가 되셨나요?" />
      <Link to={`/vote/fill/${id}`}>
        <div>투표 폼 생성하기</div>
      </Link>
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

export default VoteCreatePage;
