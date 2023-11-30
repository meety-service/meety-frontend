import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const TimeSelectBar = ({ startTime, setStartTime, endTime, setEndTime }) => {
  const hoursInDay = 24;

  const [start, setStart] = useState(null);
  const [selected, setSelected] = useState(Array(hoursInDay).fill(false));

  const handleClick = (i) => {
    if (start === null) {
      setStart(i);
      setSelected(Array(hoursInDay).fill(false));
    } else {
      let s = start;
      let e = i;

      if (s > e) {
        [s, e] = [e, s];
      }

      const newSelected = Array(hoursInDay).fill(false);
      for (let j = s; j <= e; j++) {
        newSelected[j] = true;
      }
      setSelected(newSelected);

      setStartTime(`${s.toString().padStart(2, "0")}:00:00`);
      setEndTime(`${(e + 1).toString().padStart(2, "0")}:00:00`);

      setStart(null);
    }
  };

  useEffect(() => {
    if (startTime !== "" && endTime !== "") {
      const s = startTime.split(":").map(Number)[0];
      const e = endTime.split(":").map(Number)[0];

      const newSelected = Array(hoursInDay).fill(false);
      for (let i = s; i < e; i++) {
        newSelected[i] = true;
      }
      setSelected(newSelected);
    }
  }, [startTime, endTime]);

  return (
    <div>
      <div className="flex">
        {Array(hoursInDay)
          .fill()
          .map((_, i) => (
            <div key={i} className="w-full text-[10px]">
              {i % 6 === 0 ? i : ""}
            </div>
          ))}
      </div>
      <div className="flex border border-solid border-meety-component_outline_gray">
        {Array(hoursInDay)
          .fill()
          .map((_, i) => (
            <div
              key={i}
              className={
                "w-full h-[40px]" +
                (i === start
                  ? " bg-black"
                  : selected[i]
                  ? " bg-[#00ff00]"
                  : "") +
                (i !== 0
                  ? " border-l border-solid border-meety-component_outline_gray"
                  : "")
              }
              style={{ opacity: i === start ? 0.5 : 1 }}
              onClick={() => handleClick(i)}
            />
          ))}
      </div>
    </div>
  );
};

TimeSelectBar.propTypes = {
  startTime: PropTypes.string.isRequired,
  setStartTime: PropTypes.func.isRequired,
  endTime: PropTypes.string.isRequired,
  setEndTime: PropTypes.func.isRequired,
};

export default TimeSelectBar;
