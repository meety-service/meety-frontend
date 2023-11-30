import React, { useRef } from "react";

import { useRecoilCallback } from "recoil";
import { isSnackbarOpenAtom, snackbarMessageAtom } from "../store/atoms";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Clipboard from "clipboard";
import ClipboardJS from "clipboard";

const LinkButton = () => {
  const openSnackbar = useRecoilCallback(({ set }) => () => {
    set(isSnackbarOpenAtom, true);
  });

  const setSnackbarText = useRecoilCallback(({ set }) => (message) => {
    set(snackbarMessageAtom, message);
  });


  const clipboardButtonRef = useRef(null);

  const copyToClipboard = () => {
    const currentURL = window.location.href;
    const clipboard = new ClipboardJS(clipboardButtonRef.current, {
      text: function() {
        return currentURL;
      }
    });

    clipboard.on('success', function(e) {
      setSnackbarText("링크가 클립보드에 복사되었습니다.");
      openSnackbar();
      e.clearSelection();
    });

    clipboard.on('error', function(e) {
      setSnackbarText("링크를 클립보드에 복사하는 데 실패했습니다.");
      openSnackbar();
    });

    clipboard.onClick(event);
  };



  return (
    <button
      className="text-[14px] text-right underline flex flex-row justify-center items-center space-x-1 text-meety-link_btn_gray decoration-meety-link_btn_gray hover:scale-[1.05] duration-75"
      // onClick={async () => {
        // await navigator.clipboard.writeText(window.location.href);
        // setSnackbarText("링크가 클립보드에 복사되었습니다.");
        // openSnackbar();
      // }}
      ref={clipboardButtonRef} onClick={copyToClipboard}
    >
      <div className="flex flex-col justify-center bg-meety-link_btn_gray rounded-sm p-[1px]">
        <AttachFileIcon fontSize={"5px"} style={{ color: "white" }} />
      </div>
      <p className="">링크 복사하기</p>
    </button>
  );
};

export default LinkButton;
