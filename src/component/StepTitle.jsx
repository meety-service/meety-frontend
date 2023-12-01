import React from "react";
import PropTypes from "prop-types";

const StepTitle = ({ title }) => {
  return <div className="text-[15px] font-[700]">{title}</div>;
};

StepTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default StepTitle;
