import axios from "axios";
import { getCookie } from "./cookie";

export const axiosWH = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 5000,
  headers: {
   "Content-Type": "application/json",
   "Access-Control-Allow-Origin": "*",
   Cookie: `X-Gapi-Refresh-Token=${getCookie('X-Gapi-Refresh-Token')};`
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
