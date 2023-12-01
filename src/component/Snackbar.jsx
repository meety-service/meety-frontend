import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { isSnackbarOpenAtom, snackbarMessageAtom } from "../store/atoms";
import CloseIcon from '@mui/icons-material/Close';

const Snackbar = () => {
  const [snackbar, setSnackbar] = useRecoilState(isSnackbarOpenAtom);
  const [snackbarText, setSnackbarText] = useRecoilState(snackbarMessageAtom);
  const showSnackbar = () => setSnackbar(!snackbar);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSnackbar(false);
      setSnackbarText("");
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [snackbar]);

    return (
        <div className="snackbar">
          <div className={`${snackbar ? "snackbar-fade-in" : "snackbar-hide"} opacity-0 fixed bottom-3 h-[60px] w-screen z-30 px-3 flex justify-center items-center`}>
            <div className="h-full w-full md:w-3/5 flex flex-rco items-center justify-between px-4 bg-meety-snackbar_background shadow-md shadow-stone-500 rounded-md">
              <p className="text-md font-medium max-w-[85%] truncate text-ellipsis overflow-hidden whitespace-nowrap text-white">
                {snackbarText}
              </p>
              <button
                className="z-40 flex items-center justify-center"
                onClick={showSnackbar}
                aria-controls="snackbar-default"
                aria-expanded="false"
              >
                <CloseIcon fontSize="medium" style={{ fill: "white" }} />
              </button>
            </div>
          </div>
        </div>
      );
};

export default Snackbar;
