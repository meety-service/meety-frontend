import React, { useEffect, useState } from "react";
import PageTitle from "./PageTitle";
import useLoginCheck from "../hooks/useLoginCheck";
import StepTitle from "./StepTitle";
import { useNavigate } from "react-router-dom";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import DatePicker from "react-datepicker";
import { axiosWH } from "../utils/axios";
import GradationButton from "./GradationButton";
import { dateFormatter } from "../utils/dateFormatter";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const MeetingCreatePage2 = () => {
  useLoginCheck();
  
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [error, handleError] = useState(undefined);
  const [selectedDates, setSelectedDates] = useState([]);
  const [timezone, setTimezone] = useState([]);
  const [selectedTimezone, setSelectedTimeZone] = useState("");
  const [timeOptions, setTimeOptions] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");


  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const createTimeOptions = () => {
    const time_options = [];
    for (let hour = 0; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        time_options.push(time);
      }
    }
    setTimeOptions(time_options);
  }

  const handleDateChange = (date) => {
    // 이미 선택한 날짜인지 확인
    const isDateSelected = selectedDates.some(
      (selectedDate) => selectedDate.getTime() === date.getTime()
    );

    // 이미 선택한 날짜인 경우 해당 날짜를 배열에서 제거
    if (isDateSelected) {
      const filteredDates = selectedDates.filter(
        (selectedDate) => selectedDate.getTime() !== date.getTime()
      );
      setSelectedDates(filteredDates);
    } else {
      // 선택한 날짜가 배열에 없는 경우 추가
      setSelectedDates([...selectedDates, date]);
    }
  };

  const onCreateButtonClick = async () => {
    const data = {
      name: title,
      available_dates: selectedDates.map((selectedDate) => {
        const date = {"date": dateFormatter(selectedDate)};
        return date;
      }),
      start_time: startTime,
      end_time: endTime,
      timezone_id: selectedTimezone
    };
    console.log(JSON.stringify(data, null, 2));

    await axiosWH
      .post("/meetings", data)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          console.log("미팅 생성 완료");
          navigate(`/meeting/fill/${response.data.id}`);
        } else {
          console.log(response);
        }
      })
      .catch(function (error) {
        handleError(error);
      });
  };


  const fetchTimezoneData = async () => {
    // 실제로 서버에서 타임존 데이터 fetch
    console.log("Fetch Timezone");
    await axiosWH
      .get("/timezones")
      .then((response) => {
        if (response.data) {
          setTimezone(response.data);
        } else {
          console.log(
            "[MeetingCreatePage2.jsx] 서버에서 타임 존 정보가 전달되지 않았습니다."
          );
        }
      })
      .catch(function (error) {
        handleError(error);
      });
      console.log("Fetch Timezone end", timezone);
  }


  useEffect(() => {
    const fetchData = async () => {
      fetchTimezoneData();
    };
    fetchData();
    createTimeOptions();
  }, []);

  return (
    <div className="nav_top_padding bg-white w-screen h-screen">
      <div className="relative flex flex-col justify-center items-center w-full h-full">
        <div className="absolute top-8 left-4">
          <PageTitle title="미팅 폼 생성하기" />
        </div>
        <div className="relative w-full h-full flex flex-col justify-center items-center px-5 pt-20 pb-28">
          {/*옵션 스크롤 바*/}
          <div className="relative flex flex-col justify-center space-y-2 w-full md:w-2/5 h-fit py-2 px-2 bg-meety-main_background rounded-xl shadow-stone-300 shadow-md">
            <StepTitle
              title="1. 미팅의 이름은 무엇인가요?"
              className="left-0 top-0"
            />
            <div className="bg-gradient-to-r from-meety-btn_light_blue to-meety-btn_dark_blue p-1 rounded-full">
              <input
                type="text"
                placeholder="ex)3주차 위클리 스크럼"
                value={title}
                onChange={handleTitleChange}
                className="pl-3 h-12 w-full rounded-full"
              />
            </div>
          </div>
          <div className="h-20 flex flex-col justify-center items-center">
            <KeyboardDoubleArrowDownIcon style={{ fill: "#BFBCC6" }} />
          </div>
          <div className="relative flex flex-col justify-center space-y-2 w-full md:w-2/5 h-fit py-2 px-2 bg-meety-main_background rounded-xl shadow-stone-300 shadow-md">
            <StepTitle
              title="1. 미팅은 어느 요일에 진행되어야 하나요?"
              className="left-0 top-0"
            />
            <DatePicker
              onChange={handleDateChange}
              dateFormat="yyyy/MM/dd"
              inline
              highlightDates={selectedDates}
            ></DatePicker>
          </div>
        </div>

        <StepTitle title="3.미팅은 어느 시간에 진행되어야 하나요?" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <StepTitle title="표준시(Time Zone)" />
          <Dropdown
            options={timezone.map((item) => { return item.name })}
            onChange={(event) => {setSelectedTimeZone((timezone.find((item) => item.name == event.value)).id)}}
            value={"지역을 선택해주세요."}
            placeholder="Select an option"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Dropdown
            options={timeOptions}
            onChange={(event) => {
              setStartTime(event.value + ":00");
            }}
            value={"00:00"}
            placeholder="Select an option"
          />
          <StepTitle title="에서" />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Dropdown
            options={timeOptions}
            onChange={(event) => {
              setEndTime(event.value + ":00");
            }}
            value={"00:00"}
            placeholder="Select an option"
          />
          <StepTitle title="사이" />
        </div>

        {/* <select
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
          </div> */}
        
        <GradationButton text="미팅 폼 생성하기" onButtonClick={onCreateButtonClick}/>
      </div>
    </div>
  );
};

export default MeetingCreatePage2;