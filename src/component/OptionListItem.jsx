import React from "react";
import PropTypes from "prop-types";
import { IndexedItemHeader } from "./";
import { formatOption } from "./VoteCreatePage";

const OptionListItem = ({ index, option, endComponent }) => {
  return (
    <div className="border-[1.5px] border-solid border-meety-component_outline_gray rounded-[10px] shadow-lg p-[10px] my-[14px]">
      <div className="w-full h-full flex justify-between items-center">
        <div className="flex items-center justify-center">
          <IndexedItemHeader index={index} />
          <div className="pl-[6px] text-sm font-[700] pb-[1px]">{formatOption(option)}</div>
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
