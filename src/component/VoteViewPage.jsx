import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  PageTitle,
  StepTitle,
  ListHeader,
  IndexedItemHeader,
  GradationButton,
  SubMessage,
} from "./";
import { closeVoteForm, getMeetingInfo, getVoteChoices } from "../utils/axios";
import { formatOption } from "./VoteCreatePage";
import useLoginCheck from "../hooks/useLoginCheck";
import { useErrorCheck } from "../hooks/useErrorCheck";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import FollowLineArea from "./FollowLineArea";

const VoteViewPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  useLoginCheck();

  const [error, handleError] = useState(undefined);
  useErrorCheck(error);

  const [meetingInfo, setMeetingInfo] = useState({});

  const [members, setMembers] = useState(0);
  const [participants, setParticipants] = useState(0);
  const [voteOptions, setVoteOptions] = useState([]);

  const voteChoices = voteOptions
    .filter((element) => element.largest_choice == true)
    .map((element, index) => formatOption(element));

  useEffect(() => {
    const fetchData = async () => {
      await getMeetingInfo(id, handleError).then((data) => {
        setMeetingInfo(data);
      });
      await getVoteChoices(id, handleError).then((data) => {
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
        console.log(options);
      });
    };
    fetchData();

    window.scrollTo(0,0); // 페이지 최상단으로 이동
  }, []);

  return (
    <div className="nav_top_padding mobile-h-fit bg-white w-full h-fit">
      <div className="relative flex flex-col justify-center items-center w-full h-full">
        <div className="relative w-full h-full flex flex-col justify-center items-center mt-4 px-5 pb-10">
          <div className="relative flex flex-col justify-center space-y-2 w-full md:w-2/5 h-fit py-2 px-2 rounded-xl">
          <div className="w-full pb-6">
              <PageTitle title="투표 폼 작성 완료" />
            </div>
            <StepTitle title="1. 투표 현황을 확인해 보세요." />

            <div className="mt-10 shadow-md shadow-stone-400 rounded-t-[10px]">
              <ListHeader title="투표 현황" />
            </div>
            <div>
              {voteOptions.map((option, index) => (
                <div
                  key={index}
                  className={
                    "flex justify-between items-center border-[1.5px] border-solid border-meety-component_outline_gray rounded-[10px] shadow-lg px-[6px] py-[8px] my-[14px]" +
                    (option.user_choice
                      ? " bg-gradient-to-r from-meety-btn_light_blue to-meety-btn_dark_blue text-white"
                      : "")
                  }
                >
                  <div className="flex items-center">
                    <IndexedItemHeader
                      index={index}
                      isInverted={option.user_choice === true}
                    />
                    <div className="w-[6px]" />
                    <div className="text-[12px] font-[700]">
                      {formatOption(option)}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {option.largest_choice ? (
                      <div className="border border-solid border-meety-component_outline_gray rounded-[8px] text-[8px] font-[700] px-[6px] py-[2px] mx-[6px]">
                        최다 득표
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="text-[12px] w-[50px]">
                      {option.count}/{members} (명)
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-[12px] text-right pr-4">
                {members}명 중 {participants}명 참여
              </div>
            </div>

            <FollowLineArea />

            <div className="relative flex flex-col justify-center space-y-2 w-full h-fit py-2 pb-6">
              <StepTitle title="2. 혹시 다시 투표하고 싶으신가요?" />
              <SubMessage title="아래의 ‘수정하기’ 버튼을 클릭하여 이전에 작성했던 투표 폼을 수정할 수 있습니다." />
            </div>

            <GradationButton
              text="다시 투표하기"
              onButtonClick={() => navigate(`/vote/fill/${id}`)}
            />

            {meetingInfo.isMaster && (
              <div>
                <FollowLineArea />

                <div className="relative flex flex-col justify-center space-y-2 w-full h-fit py-2 pb-4">
                  <StepTitle title="3. 투표를 마감할까요?" />
                  <SubMessage title="투표를 마감하면 현재까지 가장 많은 투표를 받은 날짜로 미팅 일자가 결정됩니다." />
                </div>

                <div className="">
                  {voteChoices.length == 1 ? (
                    <div className="flex flex-col justify-center w-full h-fit pb-4">
                    <p className="flex justify-center font-bold">미팅 일자 : {voteChoices}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center w-full h-fit pb-4">
                      {voteChoices.map((choice, index) => (
                        <p key={index} className="flex justify-center font-bold">
                          미팅 일자 {index + 1} : {choice}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <GradationButton
                  text="투표 마감하기"
                  onButtonClick={async () => {
                    await closeVoteForm(id, handleError);
                    navigate(`/meeting/confirmed/${id}`, { replace: true });
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteViewPage;
