import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { PageTitle, StepTitle, ListHeader } from "./";

const VoteViewPage = () => {
  const { id } = useParams();

  const [voteOptions, setVoteOptions] = useState([
    { date: "2023-11-29", start_time: "10:00:00", end_time: "18:00:00" },
    { date: "2023-11-30", start_time: "11:00:00", end_time: "19:00:00" },
    { date: "2023-11-29", start_time: "12:00:00", end_time: "20:00:00" },
    { date: "2023-11-30", start_time: "13:00:00", end_time: "21:00:00" },
    { date: "2023-11-29", start_time: "14:00:00", end_time: "22:00:00" },
    { date: "2023-11-28", start_time: "15:00:00", end_time: "23:00:00" },
    { date: "2023-11-27", start_time: "16:00:00", end_time: "23:30:00" },
  ]);

  const [isMostVoted, setMostVoted] = useState(
    Array(voteOptions.length).fill(false)
  );

  const initMostVoted = (mostVotedOptions) => {
    const newMostVoted = [...isMostVoted];
    mostVotedOptions.forEach((index) => (newMostVoted[index] = true));
    setMostVoted(newMostVoted);
  };

  const [isMyVoted, setMyVoted] = useState(
    Array(voteOptions.length).fill(false)
  );

  const initMyVoted = (myVotedOptions) => {
    const newMyVoted = [...isMyVoted];
    myVotedOptions.forEach((index) => (newMyVoted[index] = true));
    setMyVoted(newMyVoted);
  };

  useEffect(() => {
    initMostVoted([1, 2]);
    initMyVoted([1, 3]);
  }, []);

  return (
    <div className="nav_top_padding mobile_h_fit">
      <PageTitle title="투표 폼 작성 완료" />
      <StepTitle title="1. 투표 현황을 확인해 보세요." />
      <ListHeader title="투표 현황" />
      {voteOptions.map((option, index) => (
        <div
          key={index}
          className={
            isMyVoted[index]
              ? "bg-gradient-to-r from-meety-btn_light_blue to-meety-btn_dark_blue"
              : ""
          }
        >
          {index + 1} {option.date} {option.start_time} {option.end_time}{" "}
          {isMostVoted[index] ? "최다 득표" : ""}
        </div>
      ))}
    </div>
  );
};

export default VoteViewPage;
