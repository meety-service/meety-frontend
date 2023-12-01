import React, { useState } from "react";
import PropTypes from "prop-types";

const DragBar = ({ meetingForm, members, degrees, isDraggable = true }) => {
  const { meeting_dates, start_time, end_time, timezone } = meetingForm;
  const intervals = calculateIntervals(start_time, end_time);
  const offset = calculateOffset(start_time);

  const [selectedTimes, setSelectedTimes] = useState([]);

  const handleTimeSlotClick = (dateIndex, timeIndex) => {
    const isSelected = selectedTimes.some(
      ([selectedDateIndex, selectedTimeIndex]) =>
        selectedDateIndex === dateIndex && selectedTimeIndex === timeIndex
    );

    if (isSelected) {
      setSelectedTimes((prevSelectedTimes) =>
        prevSelectedTimes.filter(
          ([selectedDateIndex, selectedTimeIndex]) =>
            !(
              selectedDateIndex === dateIndex && selectedTimeIndex === timeIndex
            )
        )
      );
    } else {
      setSelectedTimes((prevSelectedTimes) => [
        ...prevSelectedTimes,
        [dateIndex, timeIndex],
      ]);
    }
  };

  return (
    <div>
      <div className="flex justify-end items-center text-[12px] font-[700] text-right my-4">
        <div>표준시 (Time Zone)</div>
        <div className="w-[6px]" />
        <div className="flex w-[142px] h-[26px] items-center border border-solid border-meety-component_outline_gray rounded-[5px] px-[6px]">
          {timezone}
        </div>
      </div>
      <div className="flex">
        {meeting_dates.map((meeting_date, i) => {
          const { available_date } = meeting_date;
          const weekday = new Date(available_date).getDay();

          return (
            <div key={i} className="flex flex-col items-center mx-[4px]">
              <div className="text-[8px] font-[700]">
                {formatDate(available_date)}
              </div>
              <div
                className={
                  "text-[14px] font-[700]" +
                  (weekday === 6
                    ? " text-meety-menu_sat_blue"
                    : weekday === 0
                    ? " text-red-700"
                    : "")
                }
              >
                {formatWeekday(available_date)}
              </div>
              <div>
                {Array.from({ length: intervals }, (_, j) => (
                  <div
                    key={j}
                    className={`relative w-[46px] h-[11px] border border-solid border-meety-component_outline_gray ${
                      selectedTimes.some(
                        ([selectedDateIndex, selectedTimeIndex]) =>
                          selectedDateIndex === i && selectedTimeIndex === j
                      )
                        ? "bg-blue-500"
                        : ""
                    }`}
                    onClick={() => handleTimeSlotClick(i, j)}
                  >
                    <div
                      className="absolute top-0 left-0 w-[44px] h-[9px] bg-[#0000ff]"
                      style={{
                        opacity:
                          degrees[i] && degrees[i][j]
                            ? degrees[i][j] / members
                            : 0,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

DragBar.propTypes = {
  meetingForm: PropTypes.shape({
    meeting_dates: PropTypes.arrayOf(
      PropTypes.shape({
        available_date: PropTypes.string.isRequired,
      })
    ).isRequired,
    start_time: PropTypes.string.isRequired,
    end_time: PropTypes.string.isRequired,
    timezone: PropTypes.string.isRequired,
  }).isRequired,
  members: PropTypes.number.isRequired,
  degrees: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number.isRequired))
    .isRequired,
  isDraggable: PropTypes.bool,
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatWeekday = (dateString) => {
  return new Date(dateString)
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
};

const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

export const calculateIntervals = (startTime, endTime) => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  return Math.floor((endMinutes - startMinutes) / 15);
};

const calculateOffset = (startTime) => {
  const startMinutes = timeToMinutes(startTime);
  return Math.floor((startMinutes / 15) % 4);
};

export default DragBar;
