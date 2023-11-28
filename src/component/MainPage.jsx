import React, { useCallback, useEffect, useState } from "react";
import PageTitle from "./PageTitle";
import { useNavigate } from "react-router-dom";
import GradationButton from "./GradationButton";
import MainOptionButton from "./MainOptionButton";
import { axiosWH } from "../utils/axios";
import useLoginCheck from "../hooks/useLoginCheck";
import { useErrorCheck } from "../hooks/useErrorCheck";

const MainPage = () => {
  const navigate = useNavigate();
  const [meetingInfo, setMeetingInfo] = useState([]);
  const [error, handleError] = useState(undefined);

  // 사용자의 state 확인 후 어느 페이지로 이동할지 결정
  const getNavigationUrl = useCallback((id, state) => {
    switch (state) {
      case 0: // 미팅 폼 작성 이전 -> 미팅 폼 작성 페이지
        return `/meeting/fill/${id}`;
      case 1: // 미팅 폼 작성 이후 -> 미팅 폼 작성 완료 페이지
        return `/meeting/view/${id}`;
      case 2: // 투표 참여 이전 -> 투표 폼 작성 페이지
        return `/vote/fill/${id}`;
      case 3: // 투표 참여 이전 -> 투표 폼 작성 완료 페이지
        return `/vote/view/${id}`;
      case 4: // 미팅 확정 -> 미팅 확정 페이지
        return `/meeting/confirmed/${id}`;
      default: // user_status 에러 -> 에러 페이지
        return `/error`;
    }
  });

  // 미팅 삭제
  const onHandleDeleteButtonClick = async (info) => {
    await axiosWH
      .delete(`/meetings/${info.id}`)
      .then((response) => {
        if (response.status == 200) {
          console.log("미팅 삭제 완료");
          fetchMeetingInfo(); // 서버에서 data 다시 fetch
        }
      })
      .catch(function (error) {
        handleError(error);
      });
  };

  // 리스트에서 삭제
  const onHandleRemoveFromListButtonClick = async (info) => {
    await axiosWH
      .patch(`/meetings/${info.id}/hiding`)
      .then((response) => {
        if (response.status == 200) {
          console.log("리스트에서 삭제 완료");
          fetchMeetingInfo(); // 서버에서 data 다시 fetch
        }
      })
      .catch(function (error) {
        handleError(error);
      });
  };

  const fetchMeetingInfo = async () => {
    // 실제로 서버에서 데이터 fetch
    await axiosWH
      .get("/meetings")
      .then((response) => {
        if (response.data) {
          console.log(response);
          setMeetingInfo(response.data); // 사용자의 미팅 정보 저장
        } else {
          console.log(
            "[MainPage.jsx] 서버에서 미팅 정보가 전달되지 않았습니다."
          );
        }
      })
      .catch(function (error) {
        handleError(error);
      });
  };

  // 리스트 옵션 버튼 클릭 후 해당 미팅 페이지로 이동
  const onOptionButtonClick = async (info) => {
    const data = {
      user_state: info.user_state,
    };

    await axiosWH
      .post(`/meetings/${info.id}/user-state`, data)
      .then((response) => {
        if (response.data) {
          console.log(
            `Is valid user-state : ${response.data.is_validate_state}`
          );
          console.log(`Current state : ${info.user_state}`);
          console.log(`Updated state : ${response.data.latest_user_state}`);
          const url = getNavigationUrl(
            info.id,
            response.data.is_validate_state
              ? info.user_state
              : response.data.latest_user_state
          );
          navigate(url);
        } else {
          // TODO: 데이터가 전달되지 않은 경우, ErrorPage로 이동 및 적절한 에러 문구 표시
          console.log(
            "[MainPage.jsx] 서버에서 갱신된 user_state 정보가 전달되지 않았습니다."
          );
        }
      })
      .catch(function (error) {
        handleError(error);
      });
  };

  useLoginCheck(); // 로그인 여부 확인 -> 미 로그인 시 로그인 페이지로 이동
  useErrorCheck(error);

  // 서버에서 미팅 정보 fetch
  useEffect(() => {
    const fetchData = async () => {
      fetchMeetingInfo();
    };
    fetchData();
  }, []);

  return (
    <div className="nav_top_padding mobile-h-fit bg-white w-full h-screen">
      <div className="relative flex flex-col justify-center items-center w-full h-full">
        <div className="relative w-full h-full flex flex-col justify-center items-center mt-4 px-5 pb-10">
          <div className="relative flex flex-col justify-center space-y-2 w-full h-full md:w-2/5 py-2 px-2 rounded-xl">
            <div className="w-full pb-4">
              <PageTitle title="미팅 폼 작성하기" />
            </div>
            <div className="w-full h-full flex flex-col justify-center items-center pb-8">
              {/*옵션 스크롤 바*/}
              <div className="w-full h-full py-2 px-2 bg-meety-main_background rounded-xl shadow-stone-300 shadow-md">
                <div className="w-full h-full space-y-4 overflow-y-scroll scrollbar-hide p-1 rounded-xl shadow-sm">
                  {meetingInfo.map((info) => (
                    <MainOptionButton
                      key={info.id}
                      info={info}
                      text={info.name}
                      isMaster={info.isMaster}
                      onOptionButtonClick={() => {
                        onOptionButtonClick(info);
                      }}
                      onHandleDeleteButtonClick={() => {
                        onHandleDeleteButtonClick(info);
                      }}
                      onHandleRemoveFromListButtonClick={() => {
                        onHandleRemoveFromListButtonClick(info);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <GradationButton
              text={"새로운 미팅 생성하기"}
              onButtonClick={() => navigate("/meeting/create")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
