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
  TimeSlot,
} from "./";
import {
  getMeetingInfo,
  getMeetingForm,
  getMySchedules,
  getVoteChoices,
  submitVotes,
  editVotes,
} from "../utils/axios";
import { formatOption } from "./VoteCreatePage";
import useLoginCheck from "../hooks/useLoginCheck";
import { useErrorCheck } from "../hooks/useErrorCheck";
import { calculateIntervals } from "./TimeSlot";
import { useRecoilCallback } from "recoil";
import { isSnackbarOpenAtom, snackbarMessageAtom } from "../store/atoms";
import LinkButton from "./LinkButton";
import FollowLineArea from "./FollowLineArea";

const VoteFillPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  useLoginCheck();

  const [error, handleError] = useState(undefined);
  useErrorCheck(error);

  const openSnackbar = useRecoilCallback(({ set }) => () => {
    set(isSnackbarOpenAtom, true);
  });

  const setSnackbarText = useRecoilCallback(({ set }) => (message) => {
    set(snackbarMessageAtom, message);
  });

  const [meetingInfo, setMeetingInfo] = useState({});

  const [meetingForm, setMeetingForm] = useState({
    meeting_dates: [],
    start_time: "00:00:00",
    end_time: "00:00:00",
    timezone: "",
  });
  const [members, setMembers] = useState(0);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [degrees, setDegrees] = useState([]);

  const [participants, setParticipants] = useState(0);
  const [voteOptions, setVoteOptions] = useState([]);
  const [myVotes, setMyVotes] = useState([]);

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
        setMeetingInfo(data);
      });
      await getMeetingForm(id, handleError).then((data) => {
        setMeetingForm(data);
      });
      await getMySchedules(id, handleError).then((data) => {
        setSelectedTimes(data.select_times);
      });
      await getVoteChoices(id, handleError).then((data) => {
        setMembers(data.members);
        setParticipants(data.participants);
        setVoteOptions(data.vote_choices);
        setMyVotes(data.user_choices);
      });
    };
    fetchData();
    
    window.scrollTo(0,0); // 페이지 최상단으로 이동
  }, []);

  useEffect(() => {
    const { meeting_dates, start_time, end_time } = meetingForm;
    const intervals = calculateIntervals(start_time, end_time);
    const newDegrees = Array.from({ length: meeting_dates.length }, () =>
      Array.from({ length: intervals }, () => 0)
    );
    selectedTimes.forEach((selectedTime) => {
      const i = meeting_dates.findIndex(
        (meeting_date) => meeting_date.available_date === selectedTime.date
      );
      if (i === -1) {
        return;
      }

      selectedTime.times.forEach((time) => {
        const j = calculateIntervals(start_time, time.time);
        if (j === intervals) {
          return;
        }

        newDegrees[i][j] = 1;
      });
    });
    setDegrees(newDegrees);
  }, [meetingForm, selectedTimes]);

  useEffect(() => {
    myVotes.forEach((vote) => {
      const i = voteOptions.findIndex((element) => element.id === vote.id);
      if (i === -1) {
        return;
      }

      const newSelected = [...isSelected];
      newSelected[i] = true;
      setSelected(newSelected);
    });
  }, [myVotes]);

  return (
    <div className="nav_top_padding mobile-h-fit bg-white w-full h-fit">
      <div className="relative flex flex-col justify-center items-center w-full h-full">
        <div className="relative w-full h-full flex flex-col justify-center items-center mt-4 px-5 pb-10">
          <div className="relative flex flex-col justify-center w-full md:w-2/5 h-fit py-2 px-2 rounded-xl">
            <div className="absolute top-0 right-0 h-fit z-10">
              <LinkButton />
            </div>
            <div className="relative flex flex-col justify-center space-y-2 w-full h-full">
              <div className="w-full pb-6">
                <PageTitle title="투표 폼 작성하기" />
              </div>
              <StepTitle
                title="1. 내 미팅 가능 시간을 확인해보세요."
                className="left-0 top-0"
              />

              <TimeSlot
                meetingForm={meetingForm}
                members={1}
                degrees={degrees}
              />

              <div className="mt-10 shadow-md shadow-stone-400 rounded-t-[10px]">
                <ListHeader title="미팅을 원하는 시간대를 선택하세요." />
              </div>

              <div>
                {voteOptions.map((option, index) => (
                  <button
                    key={index}
                    className={
                      "flex w-full border-[1.5px] border-solid rounded-[10px] shadow-lg px-[6px] py-[8px] my-[14px]" +
                      (isSelected[index]
                        ? " border-meety-btn_dark_blue"
                        : " border-meety-component_outline_gray")
                    }
                    onClick={() => handleSelect(index)}
                  >
                    <div className="w-full h-full flex flex-row justify-between items-center">
                      <div className="w-full flex flex-row items-center">
                        <IndexedItemHeader index={index} />
                        <div className="pl-[6px] text-sm font-[700] pb-[1px]">
                          {formatOption(option)}
                        </div>
                      </div>

                      <div className="text-[12px] w-[50px]">
                        {option.count}/{members} (명)
                      </div>
                    </div>
                  </button>
                ))}
                <div className="text-[12px] text-right pr-2">
                  {members}명 중 {participants}명 참여
                </div>
              </div>

              <FollowLineArea />

              <div className="relative flex flex-col justify-center space-y-2 w-full h-fit py-2 pb-6">
                <StepTitle title="2. 투표 폼 작성이 모두 끝나셨나요?" />
                <SubMessage title="아래의 제출 버튼을 클릭하여 다른 사람들에게 투표한 내용을 공유하고, 투표 현황을 확인할 수 있습니다." />
              </div>

              <GradationButton
                text="제출하기"
                onButtonClick={async () => {
                  const vote_choices = voteOptions
                    .filter((_, index) => isSelected[index])
                    .map((option) => ({
                      id: option.id,
                    }));

                  if (meetingInfo.user_state === 2) {
                    await submitVotes(
                      id,
                      { vote_choices: vote_choices },
                      handleError
                    );
                  } else if (meetingInfo.user_state === 3) {
                    await editVotes(
                      id,
                      { vote_choices: vote_choices },
                      handleError
                    );
                  } else {
                    throw new Error("unexpected user_state");
                  }

                  navigate(`/vote/view/${id}`, { replace: true });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteFillPage;
