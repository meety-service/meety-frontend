import React, { useState } from "react";
import PropTypes from "prop-types";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import PlaylistRemoveRoundedIcon from "@mui/icons-material/PlaylistRemoveRounded";

const MainOptionButton = ({ text, isMaster, onButtonClick }) => {
  const [dropDown, setDropDown] = useState(false);
  const toggleDropDown = () => setDropDown(!dropDown);

  const handleDeleteButtonClick = () => {
    console.log("미팅 삭제하기");
  };

  const handleRemoveFromListButtonClick = () => {
    console.log("리스트에서 삭제하기");
  };

  return (
    <div className="relative h-fit w-full shadow-md shadow-stone-400 rounded-xl bg-stone-100">
      <div
        className={`${
          dropDown
            ? "duration-100 rounded-tl-xl rounded-tr-xl"
            : "delay-150 duration-150 rounded-xl"
        } relative z-10 h-16 w-full flex flex-row items-center justify-between bg-gradient-to-r from-meety-btn_light_blue to-meety-btn_dark_blue p-1`}
      >
        <div
          className={`${
            dropDown
              ? "duration-100 rounded-tl-lg rounded-tr-lg"
              : "delay-150 duration-150  rounded-lg"
          } w-full h-full flex flex-row justify-center items-center bg-white`}
        >
          <button
            onClick={() => {
              onButtonClick();
            }}
            className="flex flex-row justify-start items-center gap-x-2 w-full h-full"
          >
            <p className="text-lg font-extrabold max-w-[70%] pl-4 truncate text-ellipsis overflow-hidden whitespace-nowrap">
              {text}
            </p>
            {isMaster == 1 ? (
              <div className="flex flex-col justify-center items-center bg-gradient-to-r rounded-lg text-xs text-white font-bold py-1 px-3">
                방장
              </div>
            ) : null}
          </button>
          <button
            onClick={() => {
              toggleDropDown();
            }}
            className={`${
              dropDown ? "option-icon-rotate-180" : "duration-300"
            } w-20 h-full flex flex-col justify-center items-center`}
          >
            <ArrowDropDownIcon />
          </button>
        </div>
      </div>
      <div
        className={`${
          dropDown ? "main-option-menu-slide-in" : "mt-[-4em] duration-300"
        } h-16 w-full flex flex-row items-center justify-between pl-1 pr-1 pb-1 rounded-bl-lg rounded-br-lg`}
      >
        <div className="w-full h-full flex flex-row justify-between items-center bg-white rounded-bl-lg rounded-br-lg px-2">
          {isMaster == 1 ? (
            <button
              onClick={() => {
                handleDeleteButtonClick();
              }}
              className="flex flex-row justify-center items-center p-2 h-10 bg-white text-meety-del_red active:bg-meety-del_red active:text-white rounded-lg"
            >
              <DeleteForeverRoundedIcon fontSize="small"/>
              <div className="pl-1 font-extrabold text-sm">미팅 삭제하기</div>
            </button>
          ) : (
            <div className="h-1 w-1" />
          )}
          <button
            onClick={() => {
              handleRemoveFromListButtonClick();
            }}
            className="flex flex-row justify-center items-center p-2 h-10 bg-white text-meety-del_red active:bg-meety-del_red active:text-white rounded-lg"
          >
            <PlaylistRemoveRoundedIcon fontSize="small"/>
            <p className="pl-1 font-extrabold text-sm">리스트에서 삭제하기</p>
          </button>
        </div>
      </div>
    </div>
  );
};

MainOptionButton.propTypes = {
  text: PropTypes.string.isRequired,
  isMaster: PropTypes.number.isRequired,
  onButtonClick: PropTypes.func.isRequired,
};

export default MainOptionButton;
