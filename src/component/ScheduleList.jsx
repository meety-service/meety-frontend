import React, { useState } from "react";
import PropTypes from "prop-types";

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
    <div>
      {schedules.map((schedule, index) => (
        <div key={index}>
          <button onClick={() => handleListOpen(index)}>{schedule.date}</button>
          {isListOpen[index] &&
            schedule.times.map((time, index) => (
              <div key={index} className="flex justify-between">
                {time.time}
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
          available: PropTypes.arrayOf(
            PropTypes.shape({
              nickname: PropTypes.string.isRequired,
            })
          ).isRequired,
          unavailable: PropTypes.arrayOf(
            PropTypes.shape({
              nickname: PropTypes.string.isRequired,
            })
          ).isRequired,
        }).isRequired
      ),
    })
  ).isRequired,
};

export default ScheduleList;
