import React from "react";
import PropTypes from "prop-types";

const ListHeader = ({ title }) => {
  return (
    <div className="flex h-[37px] items-center rounded-t-[10px] bg-gradient-to-r from-meety-btn_light_blue to-meety-btn_dark_blue">
      <p className="text-[15px] font-[700] text-white">{title}</p>
    </div>
  );
};

ListHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ListHeader;
