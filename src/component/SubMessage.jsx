import React from "react";
import PropTypes from "prop-types";

const SubMessage = ({ title }) => {
  return (
    <p className="text-[10px] font-medium text-meety-exp_text_gray leading-[0.5rem] pl-5">
      {title}
    </p>
  );
};

SubMessage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default SubMessage;
