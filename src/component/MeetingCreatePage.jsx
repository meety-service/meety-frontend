import React, { useState, useEffect, useParams } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import Dropdown from "react-dropdown";
import "react-datepicker/dist/react-datepicker.css";
import "react-dropdown/style.css";
import "../App.css";
import timezones from "../utils/timezone.js";


import {
  Route,
  Link,
  BrowserRouter,
  useNavigate,
  useLocation,
} from "react-router-dom";
import useLoginCheck from "../hooks/useLoginCheck";
import { useErrorCheck } from "../hooks/useErrorCheck";
import { handleError } from "../utils/handleError";
import { mapTimezonesToIds } from "../utils/mapTimezonesToIds";
import { axiosWH } from "../utils/axios";

import {
  PageTitle,
  StepTitle,
  SubMessage,
  ListHeader,
  GradationButton,
} from "./";

const CustomDatePicker = ({ selected, onChange }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  useLoginCheck();

  const handleDateChange = (date) => {
    if (selected && selected.getTime() === date.getTime()) {
      onChange(null);
    } else {
      onChange(date);
    }
  };

  return (
    <DatePicker
      selected={selected}
      onChange={handleDateChange}
      dateFormat="yyyy/MM/dd"
      inline
      className="react-datepicker"
    />
  );
};

CustomDatePicker.propTypes = {
  selected: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  highlightDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
};

const MeetingCreatePage = () => {
  const location = useLocation();
  const [selectedDates, setSelectedDates] = useState([]);
  const [highlightDates, setHighlightedDates] = useState([]);
  const [selectedTimeZone, setSelectedTimeZone] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const country_options = [...timezones];
  const time_options = [];
  for (let hour = 0; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      time_options.push(time);
    }
  }
  const defaultOption = time_options[0];
  const [time2, setTime2] = useState(null);
  const [time3, setTime3] = useState(null);
  const navigate = useNavigate();

  const handleDateChange = (date) => {
    if (
      selectedDates.some(
        (selectedDate) =>
          selectedDate.getDate() === date.getDate() &&
          selectedDate.getMonth() === date.getMonth() &&
          selectedDate.getFullYear() === date.getFullYear()
      )
    ) {
      setSelectedDates(
        selectedDates.filter(
          (selectedDate) =>
            !(
              selectedDate.getDate() === date.getDate() &&
              selectedDate.getMonth() === date.getMonth() &&
              selectedDate.getFullYear() === date.getFullYear()
            )
        )
      );
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const _onSelect1 = (selectedOption) => {
    console.log(`Selected option: ${selectedOption}`);
    // 선택된 옵션에 대한 처리
  };

  const _onSelect2 = (selectedOption) => {
    setTime2(selectedOption.value);
    const [hour, minute] = selectedOption.value.split(":").map(Number);
    const index = hour * 4 + minute / 15;
    const startPercentage = (index / 96) * 100;
    setSelectedStartValue(startPercentage);
  };

  const _onSelect3 = (selectedOption) => {
    if (time2 && selectedOption.value < time2) {
      alert("종료 시간은 시작 시간보다 빠를 수 없습니다. 다시 선택해주세요.");
    } else {
      setTime3(selectedOption.value);
      const [hour, minute] = selectedOption.value.split(":").map(Number);
      const index = hour * 4 + minute / 15;
      const endPercentage = (index / 96) * 100;
      setSelectedEndValue(endPercentage);
    }
  };

  const handleTimezoneChange = (event) => {
    setSelectedTimeZone(event.target.value);
  };

  const [selectedStartValue, setSelectedStartValue] = useState(0);
  const [selectedEndValue, setSelectedEndValue] = useState(0);
  const [selectedValue, setSelectedValue] = useState(0);

  function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }
  const timezoneIds = mapTimezonesToIds();
  const timezoneId = timezoneIds[selectedTimeZone];

  const handleCreateMeeting = () => {
    const data = {
      name: inputValue,
      available_dates: selectedDates.map((date) => ({
        date: date.toISOString().split("T")[0],
      })),
      start_time: time2,
      end_time: time3,
      timezone_id: timezoneId,
    };

    axiosWH
      .post("/meetings", data)
      .then((response) => {
        console.log(response.data);
        navigate(`/meeting/fill_old/${response.data.id}`);
      })
      .catch((error) => {
        handleError(error);
      });
  };

  useEffect(() => {
    if (location.state && location.state.timezone) {
      setSelectedTimeZone(location.state.timezone);
    }
  }, [location.state]);

  return (
    <div className="nav_top_padding mobile_h_fit p-[14px] bg-white w-screen h-screen">
      <div className="relative flex flex-col items-center justify-center w-full h-full">
        <PageTitle title="미팅 폼 생성하기" />
        <StepTitle title="1.미팅의 이름은 무엇인가요?" />
        <input
          type="text"
          placeholder="ex)3주차 위클리 스크럼"
          value={inputValue}
          onChange={handleInputChange}
          className=""
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <StepTitle title="표준시(Time Zone)" />
          <Dropdown
            options={country_options}
            onChange={_onSelect1}
            value={"지역을 선택해주세요."}
            placeholder="Select an option"
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Dropdown
            options={time_options}
            onChange={_onSelect2}
            value={defaultOption}
            placeholder="Select an option"
          />
          <StepTitle title="에서" />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Dropdown
            options={time_options}
            onChange={_onSelect3}
            value={defaultOption}
            placeholder="Select an option"
          />
          <StepTitle title="사이" />
        </div>

        <div>
          <select
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          ></select>

          <div
            style={{
              width: "100%",
              height: "20px",
              backgroundColor: "lightgray",
            }}
          >
            <div
              style={{
                marginLeft: `${selectedStartValue}%`,
                width: `${selectedEndValue - selectedStartValue}%`,
                height: "100%",
                backgroundColor: "blue",
              }}
            />
          </div>

          <StepTitle title="4.미팅을 생성할 준비가 되셨나요?" />
          <SubMessage title="미팅 폼 생성하기 버튼을 클릭하면 다음 페이지에서 링크를 통해 미팅 폼을 다른 사람들에게 공유할 수 있습니다." />
          <GradationButton
            text="미팅 폼 생성하기"
            onButtonClick={handleCreateMeeting}
          />
        </div>
      </div>
    </div>
  );
};

export default MeetingCreatePage;
