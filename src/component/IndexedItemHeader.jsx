import React from "react";
import PropTypes from "prop-types";

const IndexedItemHeader = ({ index }) => {
  return (
    <div className="flex w-[20px] h-[24px] items-center justify-center rounded-[5px] bg-meety-cal_blue">
      <div className="text-[12px] font-[700] text-white">{index + 1}</div>
    </div>
  );
};

IndexedItemHeader.propTypes = {
  index: PropTypes.number.isRequired,
};

export default IndexedItemHeader;
