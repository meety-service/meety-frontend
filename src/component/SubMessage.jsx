import React from "react";
import PropTypes from "prop-types";

const SubMessage = ({ title }) => {
  return (
    <p className="w-[90%] text-[10px] font-medium text-meety-exp_text_gray pl-5 leading-[1rem]">
      {title}
    </p>
  );
};

SubMessage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default SubMessage;
