import React from "react";
import PropTypes from "prop-types";

const PageTitle = ({ title }) => {
  return <div className="text-[24px] font-[700]">{title}</div>;
};

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PageTitle;
