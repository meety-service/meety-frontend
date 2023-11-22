import React from "react";
import PropTypes from "prop-types";

const ListHeader = ({ title, endComponent }) => {
  return (
    <div className="flex h-[37px] justify-between items-center rounded-t-[10px] bg-gradient-to-r from-meety-btn_light_blue to-meety-btn_dark_blue p-[8px]">
      <p className="text-[15px] font-[700] text-white">{title}</p>
      {endComponent}
    </div>
  );
};

ListHeader.propTypes = {
  title: PropTypes.string.isRequired,
  endComponent: PropTypes.element,
};

export default ListHeader;
