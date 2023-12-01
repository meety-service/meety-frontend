import React, { useState } from "react";
import PropTypes from "prop-types";
import { IndexedItemHeader } from "./";
import { formatTime } from "./VoteCreatePage";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";

const ScheduleList = ({ schedules }) => {
  const [isListOpen, setListOpen] = useState(
    Array(schedules.length).fill(false)
  );

  const handleListOpen = (index) => {
    const newListOpen = [...isListOpen];
    newListOpen[index] = !isListOpen[index];
    setListOpen(newListOpen);
  };

  if (schedules.length === 0) {
    return (
      <div className="border-solid border-meety-component_outline_gray border-x-[1.5px] border-b-[1.5px]">
        <div className="flex w-full h-[80px] justify-center items-center border-b border-solid border-meety-component_outline_gray text-sm text-meety-text_dark_gray font-[700] pl-3">
          겹치는 시간대가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div>
      {schedules.map((schedule, index) => (
        <div
          key={index}
          className="border-solid border-meety-component_outline_gray border-x-[1.5px] border-b-[1.5px]"
        >
          <div
            className={`flex w-full h-[40px] justify-between items-center border-solid border-meety-component_outline_gray text-[15px] font-[700] pl-3 ${
              isListOpen.find((item) => item === true) === undefined
                ? "bg-white"
                : isListOpen[index]
                ? "bg-white"
                : "bg-meety-vote_option_background"
            }`}
          >
            {schedule.date}
            <button
            onClick={() => {
              handleListOpen(index);
            }}
            className={`${
              isListOpen[index] ? "option-icon-rotate-180" : "duration-300"
            } w-10 h-full flex flex-col justify-center items-center`}
          >
            <ArrowDropDown />
          </button>
          </div>
          {isListOpen[index] &&
            schedule.cases.map((element, index) => (
              <div
                key={index}
                className="flex h-[40px] justify-between items-center px-[6px] border-t-[1.5px] border-solid border-meety-component_outline_gray"
              >
                <div className="pl-1 flex items-center">
                  <IndexedItemHeader index={index} />
                  <div className="pl-2 text-[12px] font-[700]">
                    {formatTime(element.time)}
                  </div>
                </div>
                <div className="text-[12px] pr-[6px]">{element.availMemRatio}</div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

ScheduleList.propTypes = {
  schedules: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      cases: PropTypes.arrayOf(
        PropTypes.shape({
          time: PropTypes.string.isRequired,
          availMemRatio: PropTypes.string.isRequired,
        }).isRequired
      ),
    })
  ).isRequired,
};

export default ScheduleList;
