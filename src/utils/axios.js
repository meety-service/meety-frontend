import axios from "axios";
import { getCookie } from "./cookie";

// axios에 해더 정보를 미리 저장
export const axiosWH = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_URL,
  timeout: 5000,
  headers: {
   "Content-Type": "application/json",
   "Access-Control-Allow-Origin": "*",
   Cookie: `${process.env.REACT_APP_USER_TOKEN}=${getCookie(process.env.REACT_APP_USER_TOKEN)};`
 },
 withCredentials: true,
 responseType: "json",
});

export const getMeetingForm = async (id) => {
  try {
    const response = await axios.get("/data/meeting_form.json");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getAllSchedules = async (id) => {
  try {
    const response = await axios.get("/data/all_schedules.json");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getVoteChoices = async (id) => {
  try {
    const response = await axios.get("/data/vote_choices.json");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getMeetingInfo = async () => {
  try {
    const response = await axios.get("/data/main_meeting.json");
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
