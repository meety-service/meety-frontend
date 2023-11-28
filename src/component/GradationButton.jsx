import React from "react";
import PropTypes from "prop-types";

const GradationButton = ({ text, onButtonClick }) => {
  return (
    <div className="flex flex-row justify-center items-center w-full">
      <button
        onClick={() => {
          onButtonClick();
        }}
        className="h-[68px] flex flex-row items-center justify-center align-middle w-full bg-gradient-to-r from-meety-btn_middle_blue to-meety-btn_dark_blue rounded-full shadow-md shadow-stone-500"
      >
        <p className="text-xl font-extrabold text-white">
          {text}
        </p>
      </button>
    </div>
  );
};

GradationButton.propTypes = {
  text: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func.isRequired,
};

export default GradationButton;
