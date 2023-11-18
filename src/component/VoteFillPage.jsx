import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PageTitle, StepTitle, ListHeader } from "./";

const VoteFillPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [voteOptions, setVoteOptions] = useState([
    { date: "2023-11-29", start_time: "10:00:00", end_time: "18:00:00" },
    { date: "2023-11-30", start_time: "11:00:00", end_time: "19:00:00" },
    { date: "2023-11-29", start_time: "12:00:00", end_time: "20:00:00" },
    { date: "2023-11-30", start_time: "13:00:00", end_time: "21:00:00" },
    { date: "2023-11-29", start_time: "14:00:00", end_time: "22:00:00" },
    { date: "2023-11-28", start_time: "15:00:00", end_time: "23:00:00" },
    { date: "2023-11-27", start_time: "16:00:00", end_time: "23:30:00" },
  ]);

  const [isSelected, setSelected] = useState(
    Array(voteOptions.length).fill(false)
  );

  const handleSelect = (index) => {
    const newSelected = [...isSelected];
    newSelected[index] = !isSelected[index];
    setSelected(newSelected);
  };

  return (
    <div className="nav_top_padding mobile_h_fit">
      <PageTitle title="투표 폼 작성하기" />
      <StepTitle title="1. 내 미팅 가능 시간을 확인해보세요." />
      <ListHeader title="미팅을 원하는 시간대를 선택하세요." />
      {voteOptions.map((option, index) => (
        <div
          key={index}
          className={
            isSelected[index]
              ? "bg-gradient-to-r from-meety-btn_light_blue to-meety-btn_dark_blue"
              : ""
          }
        >
          <button onClick={() => handleSelect(index)}>
            {index + 1} {option.date} {option.start_time} {option.end_time}
          </button>
        </div>
      ))}
      <div>
        <button
          disabled={isSelected.every((e) => e === false)}
          onClick={() => {
            navigate(`/vote/view/${id}`, { replace: true });
          }}
        >
          제출하기
        </button>
      </div>
    </div>
  );
};

export default VoteFillPage;
