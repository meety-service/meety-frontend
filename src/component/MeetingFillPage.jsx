import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactSlider from "react-slider";
import useLoginCheck from "../hooks/useLoginCheck";
import { useErrorCheck } from "../hooks/useErrorCheck";
import { handleError } from "../utils/handleError";
import axios from "axios";
import { axiosWH } from "../utils/axios";

import {
  Route,
  Link,
  BrowserRouter,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import {
  PageTitle,
  StepTitle,
  SubMessage,
  ListHeader,
  GradationButton,
  DragBar,
} from "./";

const MeetingFillPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useLoginCheck();

  const { selectedDates, startTime, endTime } = location.state || {}; // selectedDates가 null인 경우 기본값 설정
  const timezone = location.state?.timezone || "기본 타임존"; // timezone이 null인 경우 기본값 설정

  // 각 날짜에 대해 슬라이더 값을 저장하는 상태 만들기
  const [sliderValues, setSliderValues] = useState(
    selectedDates?.map(() => ({ min: startTime, max: endTime })) || []
  );

  const handleSliderChange = (index) => (value) => {
    setSliderValues((prevValues) =>
      prevValues.map((val, i) =>
        i === index ? { ...val, min: value[0], max: value[1] } : val
      )
    );
  };

  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (event) => {
    //input값이 변경될 때마다 호출됨
    setInputValue(event.target.value);
  };

  useEffect(() => {
    const fetchMeetingTimes = async () => {
      try {
        const response = await axios.get(`/api/meetingTimes/${id}`);
        setSliderValues(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMeetingTimes();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0,0); // 페이지 최상단으로 이동
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.post("/api/meetingTimes", sliderValues);
      navigate(`/meeting/view/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitButtonClick = async (info) => {
      const data = {
        user_state: info.user_state,
      };
    await axiosWH
      .post(`/meetings/${id}/schedule`, data)
      .then((response) => {
        navigate(`/meeting/view/${id}`);
      })
      .catch(function (error) {
        handleError(error);
      });
  };

  // const fetchTimezones = async () => {
  //   const data = {
  //     user_state: info.user_state,
  //   };
  //   await axiosWH
  //     .get("/timezones")
  //         setTimezones(response.data); // 가져온 데이터를 timezones 상태에 설정
  //     .then((response) => {
  //         })
  //         .catch(function (error) {
  //       handleError(error);
  //     });
  // };

  return (
    <div className="nav_top_padding mobile_h_fit p-[14px]">
      <PageTitle title="미팅 폼 작성하기" />
      <StepTitle title="1.다른 사람에게 보여질 이름을 적어주세요." />
      <input
        type="text"
        placeholder="ex)홍길동"
        value={inputValue}
        onChange={handleInputChange}
      />
      <StepTitle title="2.미팅이 가능한 시간을 모두 선택해주세요." />
      <StepTitle title="표준시(Time Zone)" />
      <div className="border border-gray-200 rounded p-2">{timezone}</div>

      <div className="flex flex-row">
        {selectedDates?.map((date, index) => (
          <div key={index}>
            <div className="text-xl">
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
              })}
            </div>
            <div className="text-lg">
              {date.toLocaleDateString("en-US", { weekday: "short" })}
            </div>
            <DragBar
              min={startTime}
              max={endTime}
              step={15}
              value={[sliderValues[index]?.min, sliderValues[index]?.max]}
              onChange={handleSliderChange(index)}
              className="react-slider h-full w-1 absolute top-0 left-1/2 transform -rotate-90 origin-center bg-blue-500"
            />
          </div>
        ))}
      </div>
      <StepTitle title="3.미팅 폼 작성이 모두 끝나셨나요?" />
      <SubMessage title="아래의 제출 버튼을 클릭하여 다른 사람들에게 내 미팅 가능 시간을 공유하고, 다른 사람들의 미팅 가능 시간을 확인할 수 있습니다." />

      <GradationButton
        text="제출하기"
        onButtonClick={onSubmitButtonClick}
        // navigate(`/meeting/view/${id}`); // 백틱(`) 사용
      ></GradationButton>
    </div>
  );
};

export default MeetingFillPage;
