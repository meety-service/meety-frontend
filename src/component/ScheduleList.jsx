import React, { useState } from "react";
import PropTypes from "prop-types";
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
            className="flex w-full border-b border-solid border-meety-component_outline_gray pl-[6px]"
            onClick={() => handleListOpen(index)}
          >
            {formatDate(schedule.date)}
          </button>
          {isListOpen[index] &&
            schedule.times.map((time, index) => (
              <div
                key={index}
                className="flex justify-between border-b border-solid border-meety-component_outline_gray px-[6px]"
              >
                {formatTime(time.time)}
                <div>
                  {time.available.length}/{members} (명)
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

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

const memberPropTypes = PropTypes.shape({
  nickname: PropTypes.string.isRequired,
});

export default ScheduleList;
