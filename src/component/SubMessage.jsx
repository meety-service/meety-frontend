import React from "react";
import PropTypes from "prop-types";

const SubMessage = ({ title }) => {
  return (
    <div className="text-[10px] font-[700] text-meety-exp_text_gray">
      {title}
    </div>
  );
};

SubMessage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default SubMessage;
