import React from "react";
import PropTypes from "prop-types";
import { IndexedItemHeader } from "./";
import { formatOption } from "./VoteCreatePage";

const OptionListItem = ({ index, option, endComponent }) => {
  return (
    <div className="border border-solid border-meety-component_outline_gray rounded-[10px] shadow-lg p-[6px] my-[15px]">
      <div className="flex justify-between">
        <div className="flex items-center">
          <IndexedItemHeader index={index} />
          <div className="w-[6px]"></div>
          <div className="text-[12px] font-[700]">{formatOption(option)}</div>
        </div>
        {endComponent}
      </div>
    </div>
  );
};

OptionListItem.propTypes = {
  index: PropTypes.number.isRequired,
  option: PropTypes.shape({
    date: PropTypes.string.isRequired,
    start_time: PropTypes.string.isRequired,
    end_time: PropTypes.string.isRequired,
  }).isRequired,
  endComponent: PropTypes.element.isRequired,
};

export default OptionListItem;
