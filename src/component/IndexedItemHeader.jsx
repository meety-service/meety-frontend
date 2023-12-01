import React from "react";
import PropTypes from "prop-types";

const IndexedItemHeader = ({ index, isInverted = false }) => {
  return (
    <div
      className={
        "flex w-[20px] h-[24px] items-center justify-center rounded-[5px] pb-[0.5px]" +
        (isInverted
          ? " bg-white text-meety-cal_blue"
          : " bg-meety-cal_blue text-white")
      }
    >
      <div className="font-bold text-xs pb-[1px]">{index + 1}</div>
    </div>
  );
};

IndexedItemHeader.propTypes = {
  index: PropTypes.number.isRequired,
  isInverted: PropTypes.bool,
};

export default IndexedItemHeader;
