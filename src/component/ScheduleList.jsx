import React, { useState } from "react";
import PropTypes from "prop-types";
import { IndexedItemHeader } from "./";
import { formatDate, formatTime } from "./VoteCreatePage";

const ScheduleList = ({ members, schedules }) => {
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
            {formatDate(schedule.date)}
          </button>
          {isListOpen[index] &&
            schedule.times.map((time, index) => (
              <div
                key={index}
                className="flex h-[36px] justify-between items-center border-b border-solid border-meety-component_outline_gray px-[6px]"
              >
                <div className="flex items-center">
                  <IndexedItemHeader index={index} />
                  <div className="w-[6px]"></div>
                  <div className="text-[12px] font-[700]">
                    {formatTime(time.time)}
                  </div>
                </div>
                <div className="text-[12px]">
                  {time.available.length}/{members} (명)
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

const memberPropTypes = PropTypes.shape({
  nickname: PropTypes.string.isRequired,
});

ScheduleList.propTypes = {
  members: PropTypes.number.isRequired,
  schedules: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      times: PropTypes.arrayOf(
        PropTypes.shape({
          time: PropTypes.string.isRequired,
          available: PropTypes.arrayOf(memberPropTypes).isRequired,
          unavailable: PropTypes.arrayOf(memberPropTypes).isRequired,
        }).isRequired
      ),
    })
  ).isRequired,
};

export default ScheduleList;
