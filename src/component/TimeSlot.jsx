import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const TimeSlot = ({ meetingForm, members, degrees, isSelectable = false }) => {
  const { meeting_dates, start_time, end_time, timezone } = meetingForm;
  const intervals = calculateIntervals(start_time, end_time);
  const offset = calculateOffset(start_time);

  const [startRow, setStartRow] = useState(-1);
  const [startCol, setStartCol] = useState(-1);
  const [selected, setSelected] = useState(
    Array(meeting_dates.length).fill(Array(intervals).fill(false))
  );

  const handleClick = (row, col) => {
    if (startRow === -1 && startCol === -1) {
      setStartRow(row);
      setStartCol(col);
      return;
    } else if (startRow !== -1 && startCol !== -1) {
      const value = selected[startRow][startCol];
      const rs = Math.min(startRow, row);
      const re = Math.max(startRow, row);
      const cs = Math.min(startCol, col);
      const ce = Math.max(startCol, col);

      const newSelected = selected.map((e) => [...e]);
      for (let i = rs; i <= re; i++) {
        for (let j = cs; j <= ce; j++) {
          newSelected[i][j] = !value;
        }
      }
      setSelected(newSelected);

      setStartRow(-1);
      setStartCol(-1);
      return;
    }
    throw new Error("unexpected click");
  };

  useEffect(() => {
    const { meeting_dates, start_time, end_time } = meetingForm;
    const intervals = calculateIntervals(start_time, end_time);
    setSelected(Array(meeting_dates.length).fill(Array(intervals).fill(false)));
  }, [meetingForm]);

  return (
    <div>
      <div className="flex justify-end items-center text-[12px] font-[700] text-right mb-[20px]">
        <div>표준시 (Time Zone)</div>
        <div className="w-[6px]" />
        <div className="flex w-[142px] h-[26px] items-center border border-solid border-meety-component_outline_gray rounded-[5px] px-[6px]">
          {timezone}
        </div>
      </div>
      <div className="flex justify-center my-4">
        <div className="relative flex flex-col w-12 items-center text-[8px] font-[700] mr-[6px]">
          <div className="absolute top-[28px] right-0">
            {calculateTimeAfterIntervals(start_time, 0)}
          </div>
          {offset !== 0 && (
            <div
              className="absolute right-0"
              style={{ top: `${28 + 11 * offset}px` }}
            >
              {calculateTimeAfterIntervals(start_time, offset)}
            </div>
          )}
          {Array(Math.floor((intervals - offset) / 4))
            .fill()
            .map((_, i) => (
              <div
                key={i}
                className="absolute right-0"
                style={{ top: `${28 + 11 * (4 * (i + 1) + offset)}px` }}
              >
                {calculateTimeAfterIntervals(start_time, 4 * (i + 1) + offset)}
              </div>
            ))}
          {(intervals - offset) % 4 !== 0 && (
            <div
              className="absolute right-0"
              style={{ top: `${28 + 11 * intervals}px` }}
            >
              {calculateTimeAfterIntervals(start_time, intervals)}
            </div>
          )}
        </div>
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
                    className={
                      "relative w-[46px] h-[11px] border border-solid border-meety-component_outline_gray" +
                      (j !== 0 && j % 4 === offset ? " border-t-black" : "")
                    }
                    onClick={() => {
                      if (!isSelectable) return;
                      handleClick(i, j);
                    }}
                  >
                    <div
                      className={
                        "absolute top-0 left-0 w-[44px] h-[9px]" +
                        (isSelectable
                          ? i === startRow && j === startCol
                            ? " bg-black"
                            : " bg-[#00ff00]"
                          : " bg-[#0000ff]")
                      }
                      style={{
                        opacity: isSelectable
                          ? i === startRow && j === startCol
                            ? 0.5
                            : selected[i] && selected[i][j]
                            ? 1
                            : 0
                          : degrees[i] && degrees[i][j]
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

TimeSlot.propTypes = {
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
  isSelectable: PropTypes.bool,
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
  return (4 - (Math.floor(startMinutes / 15) % 4)) % 4;
};

const calculateTimeAfterIntervals = (startTime, intervals) => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + intervals * 15;
  let hours = Math.floor(endMinutes / 60);
  const minutes = endMinutes % 60;
  const period = hours < 12 ? "AM" : "PM";
  if (hours > 12) hours -= 12;
  return `${hours < 10 ? "0" : ""}${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes} ${period}`;
};

export default TimeSlot;
