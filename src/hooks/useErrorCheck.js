import { useEffect } from "react"
import { useRecoilCallback } from "recoil";
import { errorContentAtom, errorTitleAtom, isSnackbarOpenAtom, snackbarMessageAtom } from "../store/atoms";
import { useNavigate } from "react-router-dom";

export const useErrorCheck = (error) => {
    const navigate = useNavigate();

    const setSnackbar = useRecoilCallback(({ set }) => (bool) => {
        set(isSnackbarOpenAtom, bool);
    });

    const setSnackbarText = useRecoilCallback(({ set }) => (message) => {
        set(snackbarMessageAtom, message);
    });

    const setErrorTitle = useRecoilCallback(({ set }) => (title) => {
        set(errorTitleAtom, title);
    });

    const setErrorContent = useRecoilCallback(({ set }) => (content) => {
        set(errorContentAtom, content);
    });


    useEffect(() => {
        if (error) {
            if (error.response) {
                // (1) 요청이 전송되었고, 서버가 2xx 외의 상태 코드로 응답한 경우
                console.log(error.request);
                console.log("Error case 1");
                const title = error.response.data.title;
                const content = error.response.data.content;
                const message = error.response.data.message;

                setErrorTitle(title);
                setErrorContent(content);

                if (title != undefined && content != undefined)
                    navigate('/error');
                else if (message != undefined) {
                    setSnackbarText(message);
                    setSnackbar(true);
                } else {
                    setErrorTitle("알 수 없는 에러가 발생했습니다.");
                    setErrorContent("나중에 다시 시도해주세요.");
                    navigate('/error');
                }
            } else if (error.request) {
                // (2) 요청이 전송되었지만, 응답이 수신되지 않은 경우
                console.log("Error case 2");
                let data = error.request.response;

                if (typeof data == "string") {
                    data = JSON.parse(data);
                }

                const title = data.title;
                const content = data.content;
                const message = data.error;

                if (title != undefined && content != undefined)
                    navigate('/error');
                else if (message != undefined) {
                    setSnackbarText(message);
                    setSnackbar(true);
                } else {
                    setErrorTitle("알 수 없는 에러가 발생했습니다.");
                    setErrorContent("나중에 다시 시도해주세요.");
                    navigate('/error');
                }
            } else {
                // (3) 오류가 발생한 요청을 설정하는 동안 문제가 발생한 경우
                console.log("Error case 3");
                const message = error.message;

                if (message != undefined) {
                    setSnackbarText(message);
                    setSnackbar(true);
                } else {
                    setErrorTitle("알 수 없는 에러가 발생했습니다.");
                    setErrorContent("나중에 다시 시도해주세요.");
                    navigate('/error');
                }
            }
            console.log(error.config);
            console.log("Error case 4");
            setErrorTitle("알 수 없는 에러가 발생했습니다.");
            setErrorContent("나중에 다시 시도해주세요.");
            navigate('/error');
        }
    }, [error]);
}
