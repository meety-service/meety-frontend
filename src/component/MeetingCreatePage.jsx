import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Route, Link, BrowserRouter } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { PageTitle, StepTitle, SubMessage, ListHeader } from "./";

const MeetingCreatePage = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleDateChange = (date) => {
    //사용자가 중복선택한 날짜를 selectedDates 배열에 추가
    setSelectedDates([...selectedDates, date]);
  };
  const handleInputChange = (event) => {
    //input값이 변경될 때마다 호출됨
    setInputValue(event.target.value);
  };

  return (
    <div className="nav_top_padding mobile_h_fit p-[14px]">
      <PageTitle title="미팅 폼 생성하기" />
      <StepTitle title="1.미팅의 이름은 무엇인가요?" />
      <input
        type="text"
        placeholder="ex)3주차 위클리 스크럼"
        value={inputValue}
        onChange={handleInputChange}
      />
      <StepTitle title="2.미팅은 어느 요일에 진행되어야 하나요?" />
      <DatePicker
        selected={selectedDates[0]}
        onChange={handleDateChange}
        dateFormat="yyyy/MM/dd"
        inline
        highlightDates={selectedDates}
      />
      <StepTitle title="3.미팅은 어느 시간에 진행되어야 하나요?" />

      <StepTitle title="4.미팅을 생성할 준비가 되셨나요?" />
      <SubMessage title="미팅 폼 생성하기 버튼을 클릭하면 다음 페이지에서 링크를 통해 미팅 폼을 다른 사람들에게 공유할 수 있습니다." />

      <button>
        <Link to="/meeting/fill/:id">미팅 폼 생성하기</Link>
      </button>
    </div>
  );
};

export default MeetingCreatePage;
