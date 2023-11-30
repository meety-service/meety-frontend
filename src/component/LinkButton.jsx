import React from "react";

import { useRecoilCallback } from "recoil";
import { isSnackbarOpenAtom, snackbarMessageAtom } from "../store/atoms";
import AttachFileIcon from '@mui/icons-material/AttachFile';

const LinkButton = () => {
  const openSnackbar = useRecoilCallback(({ set }) => () => {
    set(isSnackbarOpenAtom, true);
  });

  const setSnackbarText = useRecoilCallback(({ set }) => (message) => {
    set(snackbarMessageAtom, message);
  });
  return (
    <button
      className="text-[14px] text-right underline flex flex-row justify-center items-center space-x-1 text-meety-link_btn_gray decoration-meety-link_btn_gray hover:scale-[1.05] duration-75"
      onClick={async () => {
        await navigator.clipboard.writeText(window.location.href);
        setSnackbarText("링크가 클립보드에 복사되었습니다.");
        openSnackbar();
      }}
    >
        <div className="flex flex-col justify-center bg-meety-link_btn_gray rounded-sm p-[1px]">
            <AttachFileIcon fontSize={"5px"} style={{ color: 'white' }}/>
        </div>
      <p className="">링크 복사하기</p>
    </button>
  );
};

export default LinkButton;
