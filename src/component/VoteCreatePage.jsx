import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  StandbyView,
} from "./";
import {
  createVoteForm,
  getAllSchedules,
  getMeetingForm,
  getUserState,
} from "../utils/axios";
import useLoginCheck from "../hooks/useLoginCheck";
import { useErrorCheck } from "../hooks/useErrorCheck";
import { getSortedMeetingInfo } from "../utils/meetingSort";
import { calculateIntervals, timeToMinutes } from "./TimeSlot";
import { useRecoilCallback } from "recoil";
import {
  errorContentAtom,
  errorTitleAtom,
  isSnackbarOpenAtom,
  snackbarMessageAtom,
} from "../store/atoms";
import FollowLineArea from "./FollowLineArea";
import { calculateTimeIn24hAfterIntervals } from "./MeetingFillPage2";
import { AFTER_MEETING_FILL, INVALID_STATE } from "../utils/constants";
import { getNavigationUrl } from "../utils/getNavigationUrl";

const VoteCreatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meetingForm, setMeetingForm] = useState({
    meeting_dates: [],
    start_time: "00:00:00",
    end_time: "00:00:00",
    timezone: "",
  });
  const [degrees, setDegrees] = useState([]);
  const [isMinHourDropdownShown, setMinHourDropdownShown] = useState(false);
  const [selectedMinCellCount, setSelectedMinCellCount] = useState(1);
  const [sortedSchedules, setSortedSchedules] = useState([]);
  const [error, handleError] = useState(undefined);
  const [schedulesForOption, setSchedulesForOption] = useState([]);
  const [optionDate, setOptionDate] = useState("");
  const [optionStartTime, setOptionStartTime] = useState("");
  const [optionEndTime, setOptionEndTime] = useState("");
  const [voteOptions, setVoteOptions] = useState([]);
  const [isValidPage, setValidPage] = useState(false); // 사용자가 이동한 페이지가 유효한 페이지인지 확인

  // 페이지 기본 체크 항목
  useLoginCheck();
  useErrorCheck(error);

  const handleMinHourDropdown = (event) => {
    setSelectedMinCellCount(event.target.value);
    setSortedSchedules(
      getSortedMeetingInfo(
        { members, schedules },
        meetingForm.start_time,
        meetingForm.end_time,
        event.target.value
      ).schedules
    );
  };

  const openSnackbar = useRecoilCallback(({ set }) => () => {
    set(isSnackbarOpenAtom, true);
  });

  const setSnackbarText = useRecoilCallback(({ set }) => (message) => {
    set(snackbarMessageAtom, message);
  });

  const setErrorTitle = useRecoilCallback(({ set }) => (title) => {
    set(errorTitleAtom, title);
  });

  const setErrorContent = useRecoilCallback(({ set }) => (content) => {
    set(errorContentAtom, content);
  });

  const addVoteOption = () => {
    if (optionDate === "" || optionStartTime === "" || optionEndTime === "") {
      return;
    }

    const newOption = {
      date: optionDate,
      start_time: optionStartTime,
      end_time: optionEndTime,
    };

    if (
      voteOptions.some(
        (option) =>
          option.date === newOption.date &&
          option.start_time === newOption.start_time &&
          option.end_time === newOption.end_time
      )
    ) {
      return;
    }

    setVoteOptions((options) => [...options, newOption]);
  };

  const onVoteCreateButtonClick = async () => {
    console.log(voteOptions.length);
    if (voteOptions.length == 0) {
      setSnackbarText("작성된 투표 선택지가 없습니다.");
      openSnackbar();
    } else {
      await createVoteForm(
        id,
        { vote_choices: groupByDate(voteOptions) },
        handleError
      );
      navigate(`/vote/fill/${id}`, { replace: true });
    }
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
    // State 검사
    const checkState = async () => {
      let userState = await getUserState(id, handleError); // 사용자의 최신 State를 가져온다.
      console.log(`current page : meeting-view / current state : ${userState}`);
      if (userState == INVALID_STATE || userState < AFTER_MEETING_FILL) {
        setErrorTitle("원하시는 페이지를 찾을 수 없습니다.");
        setErrorContent(
          "찾으시려는 페이지의 주소가 잘못 입력되었거나, 페이지 주소의 변경 혹은 삭제로 인해 현재 사용하실 수 없습니다."
        );
        navigate("/error");
      } else if (userState > AFTER_MEETING_FILL) {
        // 투표 폼 생성 이후 시점에 다시 투표 폼 생성 페이지로 이동한 경우
        const url = getNavigationUrl(id, userState);
        navigate(url);
      } else {
        setValidPage(true);
      }
    };
    checkState();

    const fetchData = async () => {
      await getMeetingForm(id, handleError).then((data) => {
        setMeetingForm(data);
      });
      await getAllSchedules(id, handleError).then((data) => {
        setMembers(data.members);
        setSchedules(data.schedules);
      });
    };
    // 페이지가 유효할 때 데이터를 읽어온다.
    if (isValidPage) {
      fetchData();
      window.scrollTo(0, 0); // 페이지 최상단으로 이동
    }
  }, [isValidPage]);

  useEffect(() => {
    setSortedSchedules(
      getSortedMeetingInfo(
        { members, schedules },
        meetingForm.start_time,
        meetingForm.end_time,
        selectedMinCellCount
      ).schedules
    );
  }, [members, schedules, meetingForm, selectedMinCellCount]);

  useEffect(() => {
    setSchedulesForOption(getSchedulesForOption(schedules));
  }, [schedules]);

  useEffect(() => {
    setOptionDate(schedulesForOption[0]?.date ?? "");
  }, [schedulesForOption]);

  useEffect(() => {
    const optionStartTimeList = getOptionStartTimeList(
      schedulesForOption,
      optionDate
    );
    setOptionStartTime(optionStartTimeList?.[0] ?? "");
  }, [schedulesForOption, optionDate]);

  useEffect(() => {
    const optionEndTimeList = getOptionEndTimeList(
      schedulesForOption,
      optionDate,
      optionStartTime
    );
    setOptionEndTime(optionEndTimeList?.[0] ?? "");
  }, [schedulesForOption, optionDate, optionStartTime]);

  useEffect(() => {
    const { meeting_dates, start_time, end_time } = meetingForm;
    const intervals = calculateIntervals(start_time, end_time);
    const newDegrees = Array.from({ length: meeting_dates.length }, () =>
      Array.from({ length: intervals }, () => 0)
    );
    schedules.forEach((schedule) => {
      const i = meeting_dates.findIndex(
        (meeting_date) => meeting_date.available_date === schedule.date
      );
      if (i === -1) {
        return;
      }

      schedule.times.forEach((time) => {
        const j = calculateIntervals(start_time, time.time);
        if (j == intervals) {
          return;
        }

        newDegrees[i][j] += time.available.length;
      });
    });
    setDegrees(newDegrees);
  }, [meetingForm, schedules]);

  return !isValidPage ? (
    <StandbyView />
  ) : (
    <div className="nav_top_padding mobile-h-fit bg-white w-full h-fit">
      <div className="relative flex flex-col justify-center items-center w-full h-full">
        <div className="relative w-full h-full flex flex-col justify-center items-center mt-4 px-5 pb-10">
          <div className="relative flex flex-col justify-center space-y-2 w-full md:w-2/5 h-fit py-2 px-2 rounded-xl">
            <div className="w-full pb-6">
              <PageTitle title="투표 폼 생성하기" />
            </div>
            <StepTitle title="1. 모든 참여자의 미팅 가능 시간을 확인해보세요." />

            <TimeSlot
              meetingForm={meetingForm}
              members={members}
              degrees={degrees}
            />

            <div className="mt-3 shadow-md shadow-stone-400 rounded-t-[10px]">
              <ListHeader
                title="가장 많이 겹치는 시간대는?"
                endComponent={
                  <button
                    className="text-white"
                    onClick={() => {
                      setMinHourDropdownShown((prev) => !prev);
                    }}
                  >
                    <TuneRoundedIcon />
                  </button>
                }
              />
              {isMinHourDropdownShown && (
                <div className="flex w-full h-[40px] justify-between items-center border-solid border-x-[1.5px] border-b-[1.5px] border-meety-component_outline_gray p-[6px] text-meety-text_dark_gray">
                  <div className="text-xs font-bold pl-1">
                    적어도 몇 시간 이상 모여야 하나요?
                  </div>
                  <select
                    id="dropdown"
                    value={selectedMinCellCount}
                    onChange={handleMinHourDropdown}
                    className="text-xs font-bold"
                  >
                    <option value={1}>15분</option>
                    <option value={2}>30분</option>
                    {Array(
                      Math.floor(
                        calculateIntervals(
                          meetingForm.start_time,
                          meetingForm.end_time
                        ) / 4
                      )
                    )
                      .fill()
                      .map((_, index) => (
                        <option key={index} value={4 * (index + 1)}>
                          {index + 1}시간
                        </option>
                      ))}
                  </select>
                </div>
              )}
              <ScheduleList schedules={sortedSchedules} />
            </div>

            <FollowLineArea />

            <StepTitle title="2. 투표지를 만들어보세요." />

            <div className="mt-3 shadow-md shadow-stone-400 rounded-[10px]">
              <ListHeader title="투표 선택지를 추가해보세요." />
              <div className="border border-solid border-meety-component_outline_gray rounded-b-[10px]">
                <div className="flex justify-between p-[8px]">
                  <div className="text-sm font-bold pl-1">
                    (1) 날짜를 입력하세요.
                  </div>
                  <select
                    id="dropdown"
                    value={optionDate}
                    onChange={(event) => setOptionDate(event.target.value)}
                    className="text-[14px] font-[700]"
                  >
                    {schedulesForOption.map((schedule) => {
                      return (
                        <option key={schedule.date} value={schedule.date}>
                          {schedule.date}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="flex justify-between p-[8px]">
                  <div className="text-sm font-bold pl-1">
                    (2) 시작 시간을 입력하세요.
                  </div>
                  <select
                    id="dropdown"
                    value={optionStartTime}
                    onChange={(event) => setOptionStartTime(event.target.value)}
                    className="text-[14px] font-[700] w-fit"
                  >
                    {getOptionStartTimeList(
                      schedulesForOption,
                      optionDate
                    )?.map((time, index) => (
                      <option key={index} value={time}>
                        {formatTime(time)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-between p-[8px]">
                  <div className="text-sm font-bold pl-1">
                    (3) 종료 시간을 입력하세요.
                  </div>
                  <select
                    id="dropdown"
                    value={optionEndTime}
                    onChange={(event) => setOptionEndTime(event.target.value)}
                    className="text-[14px] font-[700]"
                  >
                    {getOptionEndTimeList(
                      schedulesForOption,
                      optionDate,
                      optionStartTime
                    )?.map((time, index) => (
                      <option key={index} value={time}>
                        {formatTime(time)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-center items-center h-[40px] bg-gradient-to-r from-meety-btn_light_blue to-meety-btn_dark_blue text-[16px] rounded-[10px] shadow-lg mx-[10px] mt-[20px] mb-[12px]">
                  <button
                    className="w-full h-full font-[700] text-white"
                    onClick={addVoteOption}
                  >
                    추가하기
                  </button>
                </div>
              </div>
            </div>

            {voteOptions.length != 0 && (
              <div>
                <div className="mt-10 shadow-md shadow-stone-400 rounded-t-[10px]">
                  <ListHeader title="다음과 같이 투표를 진행합니다." />
                </div>

                <div>
                  {voteOptions.map((option, index) => (
                    <OptionListItem
                      key={index}
                      index={index}
                      option={option}
                      endComponent={
                        <button
                          className="text-meety-del_red mb-[1px]"
                          onClick={() => removeVoteOption(index)}
                        >
                          <RemoveCircleOutlineRoundedIcon />
                        </button>
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            <FollowLineArea />

            <div className="relative flex flex-col justify-center space-y-2 w-full h-fit py-2 pb-6">
              <StepTitle title="3. 투표를 생성할 준비가 되셨나요?" />
              <SubMessage title="'투표 폼 생성하기' 버튼을 클릭하면 다음 페이지에서 링크를 통해 투표 폼을 다른 사람들에게 공유할 수 있습니다." />
            </div>

            <GradationButton
              text="투표 폼 생성하기"
              onButtonClick={onVoteCreateButtonClick}
            />
          </div>
        </div>
      </div>
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

const getSchedulesForOption = (schedules) => {
  const result = [];

  schedules.forEach((schedule) => {
    const times = schedule.times
      .filter((time) => time.available.length > 0)
      .map((time) => time.time);

    times.sort();

    if (times.length > 0) {
      result.push({ date: schedule.date, times: times });
    }
  });

  result.sort((a, b) => a.date.localeCompare(b.date));

  return result;
};

const getOptionStartTimeList = (schedulesForOption, optionDate) => {
  const times = schedulesForOption.find(
    (schedule) => schedule.date === optionDate
  )?.times;
  return times ?? [];
};

const getOptionEndTimeList = (
  schedulesForOption,
  optionDate,
  optionStartTime
) => {
  const times = schedulesForOption.find(
    (schedule) => schedule.date === optionDate
  )?.times;

  if (times === undefined) {
    return [];
  }

  const endMinutes = times
    .filter((time) => time >= optionStartTime)
    .map((time) => timeToMinutes(time) + 15);

  const continuousEndMinutes = [endMinutes[0]];
  for (let i = 1; i < endMinutes.length; i++) {
    if (endMinutes[i - 1] + 15 !== endMinutes[i]) {
      break;
    }

    continuousEndMinutes.push(endMinutes[i]);
  }

  return continuousEndMinutes.map((endMinute) =>
    calculateTimeIn24hAfterIntervals("00:00:00", Math.floor(endMinute / 15))
  );
};

export default VoteCreatePage;
