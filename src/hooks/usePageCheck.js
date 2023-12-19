import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { axiosWH } from "../utils/axios";
import { useRecoilCallback } from "recoil";
import { errorContentAtom, errorTitleAtom } from "../store/atoms";
import { useErrorCheck } from "./useErrorCheck";

export const usePageCheck = (pageState, id) => {

    console.log("page check");
    const navigate = useNavigate();
    const [error, handleError] = useState(undefined);

    const setErrorTitle = useRecoilCallback(({ set }) => (title) => {
        set(errorTitleAtom, title);
    });

    const setErrorContent = useRecoilCallback(({ set }) => (content) => {
        set(errorContentAtom, content);
    });

    useErrorCheck(error);

    useEffect(() => {
        const checkPage = async () => {
            const data = { "user-state": 0 };

            await axiosWH.post(`/meetings/${id}/user-state`, data)
                .then((response) => {
                    if (response.data) {
                        const userState = response.data.latest_user_state;

                        switch (userState) {
                            // 사용자가 미팅 폼 작성 이전
                            case 0: {
                                if (userState < pageState) {
                                    setErrorTitle("원하시는 페이지를 찾을 수 없습니다.");
                                    setErrorContent("찾으시려는 페이지의 주소가 잘못 입력되었거나, 페이지 주소의 변경 혹은 삭제로 인해 현재 사용하실 수 없습니다.");
                                    navigate('/error');
                                }
                                break;
                            }
                            case 1: {
                                // 사용자가 미팅 폼을 작성한 이후
                                if (userState < pageState) {
                                    setErrorTitle("원하시는 페이지를 찾을 수 없습니다.");
                                    setErrorContent("찾으시려는 페이지의 주소가 잘못 입력되었거나, 페이지 주소의 변경 혹은 삭제로 인해 현재 사용하실 수 없습니다.");
                                    navigate('/error');
                                }
                                break;
                            } case 2: {
                                // 사용자가 투표 폼 작성을 작성하기 이전
                                // 미팅 폼 작성하기, 작성 완료 페이지 -> 투표 폼 작성 페이지
                                if (pageState < userState) {
                                    navigate(`/vote/fill/${id}`);
                                } else if (userState < pageState) {
                                    setErrorTitle("원하시는 페이지를 찾을 수 없습니다.");
                                    setErrorContent("찾으시려는 페이지의 주소가 잘못 입력되었거나, 페이지 주소의 변경 혹은 삭제로 인해 현재 사용하실 수 없습니다.");
                                    navigate('/error');
                                }
                                break;
                            } case 3: {
                                // 사용자가 투표 폼 작성을 완료한 이후
                                // 미팅 폼 작성하기, 작성 완료 페이지 -> 투표 폼 작성 완료 페이지
                                if (pageState == 0 || pageState == 1) {
                                    navigate(`/vote/view/${id}`);
                                } else if (userState < pageState) {
                                    setErrorTitle("원하시는 페이지를 찾을 수 없습니다.");
                                    setErrorContent("찾으시려는 페이지의 주소가 잘못 입력되었거나, 페이지 주소의 변경 혹은 삭제로 인해 현재 사용하실 수 없습니다.");
                                    navigate('/error');
                                }
                                break;
                            } case 4: {
                                // 미팅이 확정된 이후
                                if (pageState < userState) {
                                    navigate(`/meeting/confirmed/${id}`);
                                }
                                break;
                            } case -1: {
                                setErrorTitle("원하시는 페이지를 찾을 수 없습니다.");
                                setErrorContent("찾으시려는 페이지의 주소가 잘못 입력되었거나, 페이지 주소의 변경 혹은 삭제로 인해 현재 사용하실 수 없습니다.");
                                navigate('/error');
                            }
                        }
                    } else {
                        setErrorTitle("알 수 없는 에러가 발생했습니다.");
                        setErrorContent("나중에 다시 시도해 주세요.");
                        navigate('/error');
                    }
                })
                .catch(function (error) {
                    handleError(error);
                });
        }
        checkPage();
        console.log("usePageCheck End");
    });

    return null; // 컴포넌트에서 사용하지 않는 경우 null을 반환해도 됩니다.
}
