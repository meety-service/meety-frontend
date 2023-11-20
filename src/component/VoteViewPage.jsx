import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  PageTitle,
  StepTitle,
  ListHeader,
  GradationButton,
  SubMessage,
} from "./";
import { getVoteChoices } from "../utils/axios";
import { formatOption } from "./VoteCreatePage";

const VoteViewPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [members, setMembers] = useState(0);
  const [participants, setParticipants] = useState(0);
  const [voteOptions, setVoteOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await getVoteChoices(id).then((data) => {
        setMembers(data.members);
        setParticipants(data.participants);

        const options = data.vote_choices;
        data.largest_choices.forEach(
          (largest_choice) =>
            (options.find(
              (element) => element.id === largest_choice.id
            ).largest_choice = true)
        );
        data.user_choices.forEach(
          (user_choice) =>
            (options.find(
              (element) => element.id === user_choice.id
            ).user_choice = true)
        );
        setVoteOptions(options);
      });
    };
    fetchData();
  }, []);

  return (
    <div className="nav_top_padding mobile_h_fit">
      <PageTitle title="투표 폼 작성 완료" />
      <StepTitle title="1. 투표 현황을 확인해 보세요." />
      <div className="mx-[20px]">
        <ListHeader title="투표 현황" />
        {voteOptions.map((option, index) => (
          <div
            key={index}
            className={
              "flex justify-between" +
              (option.user_choice
                ? " bg-gradient-to-r from-meety-btn_light_blue to-meety-btn_dark_blue"
                : "")
            }
          >
            <div className="flex">
              <div>{index + 1}</div>
              <div className="w-[6px]" />
              <div>{formatOption(option)}</div>
            </div>
            <div className="flex">
              {option.largest_choice ? (
                <div className="px-[6px]">최다 득표</div>
              ) : (
                ""
              )}
              <div>
                {option.count}/{participants} (명)
              </div>
            </div>
          </div>
        ))}
        <div className="text-right">
          {members}명 중 {participants}명 참여
        </div>
      </div>
      <StepTitle title="2. 혹시 다시 투표하고 싶으신가요?" />
      <SubMessage title="아래의 ‘수정하기’ 버튼을 클릭하여 이전에 작성했던 투표 폼을 수정" />
      <SubMessage title="할 수 있습니다." />
      <GradationButton
        text="다시 투표하기"
        onButtonClick={() => {
          navigate(`/vote/fill/${id}`);
        }}
      />
      <StepTitle title="3. 투표를 마감할까요?" />
      <SubMessage title="투표를 마감하면 현재까지 가장 많은 투표를 받은 날짜로 미팅 일자가" />
      <SubMessage title="결정됩니다." />
      <div>미팅 일자: 10월 6일 (금) 16:30 ~ 18:00</div>
      <GradationButton
        text="투표 마감하기"
        onButtonClick={() => {
          navigate(`/meeting/confirmed/${id}`, { replace: true });
        }}
      />
    </div>
  );
};

export default VoteViewPage;
