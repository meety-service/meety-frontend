import axios from "axios";
import { getCookie } from "./cookie";
import { TEST_SERVER_BASE_URL, USER_TOKEN } from "./constants";

// axios에 해더 정보를 미리 저장
export const axiosWH = axios.create({
  baseURL: TEST_SERVER_BASE_URL,  // TODO: 실제 서버 URL로 변경
  timeout: 5000,
  headers: {
   "Content-Type": "application/json",
   "Access-Control-Allow-Origin": "*",
   Cookie: `${USER_TOKEN}=${getCookie(USER_TOKEN)};`
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
