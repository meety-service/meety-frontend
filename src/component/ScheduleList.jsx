import React, { useState } from "react";
import PropTypes from "prop-types";
import { IndexedItemHeader } from "./";
import { formatTime } from "./VoteCreatePage";

const ScheduleList = ({ schedules }) => {
  const [isListOpen, setListOpen] = useState(
    Array(schedules.length).fill(false)
  );

  const handleListOpen = (index) => {
    const newListOpen = [...isListOpen];
    newListOpen[index] = !isListOpen[index];
    setListOpen(newListOpen);
  };

  return (
    <div className="shadow-lg">
      {schedules.map((schedule, index) => (
        <div
          key={index}
          className="border-x border-solid border-meety-component_outline_gray"
        >
          <button
            className="flex w-full h-[40px] items-center border-b border-solid border-meety-component_outline_gray text-[15px] font-[700] pl-[6px]"
            onClick={() => handleListOpen(index)}
          >
            {schedule.date}
          </button>
          {isListOpen[index] &&
            schedule.cases.map((element, index) => (
              <div
                key={index}
                className="flex h-[36px] justify-between items-center border-b border-solid border-meety-component_outline_gray px-[6px]"
              >
                <div className="flex items-center">
                  <IndexedItemHeader index={index} />
                  <div className="w-[6px]"></div>
                  <div className="text-[12px] font-[700]">
                    {formatTime(element.time)}
                  </div>
                </div>
                <div className="text-[12px]">{element.availMemRatio}</div>
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
