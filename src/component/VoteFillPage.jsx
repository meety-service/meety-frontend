import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PageTitle, StepTitle, ListHeader, GradationButton } from "./";
import { getVoteChoices } from "../utils/axios";

const VoteFillPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [voteOptions, setVoteOptions] = useState([]);

  const [isSelected, setSelected] = useState(
    Array(voteOptions.length).fill(false)
  );

  const handleSelect = (index) => {
    const newSelected = [...isSelected];
    newSelected[index] = !isSelected[index];
    setSelected(newSelected);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getVoteChoices(id).then((data) => {
        setVoteOptions(data.vote_choices);
      });
    };
    fetchData();
  }, []);

  return (
    <div className="nav_top_padding mobile_h_fit">
      <PageTitle title="투표 폼 작성하기" />
      <StepTitle title="1. 내 미팅 가능 시간을 확인해보세요." />
      <div className="mx-[20px]">
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
      </div>
      <GradationButton
        text="제출하기"
        onButtonClick={() => {
          navigate(`/vote/view/${id}`, { replace: true });
        }}
      />
    </div>
  );
};

export default VoteFillPage;
