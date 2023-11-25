import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const TimeSlot = ({ meetingForm, members, schedules, isDraggable = false }) => {
  const { meeting_dates, start_time, end_time, timezone } = meetingForm;
  const intervals = calculateIntervals(start_time, end_time);
  const offset = calculateOffset(start_time);

  const [degrees, setDegrees] = useState([]);

  useEffect(() => {
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
        for (let k = 0; k < 2; k++) {
          newDegrees[i][j + k] = time.available.length;
        }
      });
    });

    setDegrees(newDegrees);
  }, [meetingForm, members, schedules]);

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
                {Array.from({ length: intervals }, (_, j) => {
                  const opacity =
                    degrees.length === meeting_dates.length &&
                    degrees[i].length === intervals
                      ? degrees[i][j] / members
                      : 0;

                  return (
                    <div
                      key={j}
                      className={
                        "w-[46px] h-[11px] border border-solid border-meety-component_outline_gray" +
                        (j !== 0 && j % 4 === offset ? " border-t-black" : "")
                      }
                      style={{ opacity: 1 - opacity }}
                    />
                  );
                })}
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

export default TimeSlot;
