import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import {
  PageTitle,
  StepTitle,
  SubMessage,
  ListHeader,
  IndexedItemHeader,
  GradationButton,
} from "./";
import {
  editVotes,
  getMeetingForm,
  getMeetingInfo,
  getVoteChoices,
  submitVotes,
} from "../utils/axios";
import { formatOption } from "./VoteCreatePage";
import useLoginCheck from "../hooks/useLoginCheck";
import { useErrorCheck } from "../hooks/useErrorCheck";

const VoteFillPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  useLoginCheck();

  const [error, handleError] = useState(undefined);
  useErrorCheck(error);

  const [meetingInfo, setMeetingInfo] = useState([]);

  const [timezone, setTimezone] = useState("");
  const [members, setMembers] = useState(0);
  const [participants, setParticipants] = useState(0);
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
      await getMeetingInfo(id, handleError).then((data) => {
        setMeetingInfo(data.find((meeting) => meeting.id === parseInt(id)));
      });
      await getMeetingForm(id, handleError).then((data) => {
        setTimezone(data.timezone);
      });
      await getVoteChoices(id, handleError).then((data) => {
        setMembers(data.members);
        setParticipants(data.participants);
        setVoteOptions(data.vote_choices);
      });
    };
    fetchData();
  }, []);

  return (
    <div className="nav_top_padding mobile_h_fit">
      <div className="relative">
        <div className="absolute top-[12px] right-[12px] flex justify-end">
          <button
            className="text-[14px] text-right underline"
            onClick={async () =>
              await navigator.clipboard.writeText(
                `http://localhost:3000/vote/fill/${id}`
              )
            }
          >
            <div>링크 복사하기</div>
          </button>
        </div>
      </div>
      <div className="ml-[16px] mt-[32px]">
        <PageTitle title="투표 폼 작성하기" />
      </div>
      <div className="ml-[20px] mt-[20px]">
        <StepTitle title="1. 내 미팅 가능 시간을 확인해보세요." />
      </div>
      <div className="text-[12px] font-[700] text-right">
        표준시 (Time Zone) {timezone}
      </div>
      <div className="mx-[20px]">
        <ListHeader title="미팅을 원하는 시간대를 선택하세요." />
        {voteOptions.map((option, index) => (
          <button
            key={index}
            className={
              "flex w-full border border-solid rounded-[10px] shadow-lg p-[6px] my-[15px]" +
              (isSelected[index]
                ? " border-meety-btn_dark_blue"
                : " border-meety-component_outline_gray")
            }
            onClick={() => handleSelect(index)}
          >
            <div className="flex w-full justify-between items-center">
              <div className="flex items-center">
                <IndexedItemHeader index={index} />
                <div className="w-[6px]" />
                <div className="text-[12px] font-[700]">
                  {formatOption(option)}
                </div>
              </div>
              <div className="text-[12px]">
                {option.count}/{participants} (명)
              </div>
            </div>
          </button>
        ))}
        <div className="text-[12px] text-right">
          {members}명 중 {participants}명 참여
        </div>
      </div>
      <div className="flex w-full justify-center py-[40px]">
        <KeyboardDoubleArrowDownRoundedIcon />
      </div>
      <StepTitle title="2. 투표 폼 작성이 모두 끝나셨나요?" />
      <div className="px-[40px]">
        <SubMessage title="아래의 제출 버튼을 클릭하여 다른 사람들에게 투표한 내용을 공유하고, " />
        <SubMessage title="투표 현황을 확인할 수 있습니다." />
      </div>
      <div className="h-[20px]" />
      <GradationButton
        text="제출하기"
        onButtonClick={async () => {
          const vote_choices = voteOptions
            .filter((_, index) => isSelected[index])
            .map((option) => ({
              id: option.id,
            }));

          if (meetingInfo.user_state === 2) {
            await submitVotes(id, { vote_choices: vote_choices }, handleError);
          } else if (meetingInfo.user_state === 3) {
            await editVotes(id, { vote_choices: vote_choices }, handleError);
          } else {
            throw new Error("unexpected user_state");
          }

          navigate(`/vote/view/${id}`, { replace: true });
        }}
      />
      <div className="h-[40px]" />
    </div>
  );
};

export default VoteFillPage;
