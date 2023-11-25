import axios from "axios";
import { getCookie } from "./cookie";

// axios에 해더 정보를 미리 저장
export const axiosWH = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Cookie: `${process.env.REACT_APP_USER_TOKEN}=${getCookie(process.env.REACT_APP_USER_TOKEN)};`,
  },
  withCredentials: true,
  responseType: "json",
});

export const getTimezone = async (timezone_id) => {
  try {
    const response = await axiosWH.get("/timezones");
    return response.data.find((timezone) => timezone.id === timezone_id).name;
  } catch (error) {
    console.error(error);
  }
};

export const getMeetingForm = async (id) => {
  try {
    const response = await axiosWH.get(`/meetings/${id}`);
    const data = response.data;

    const timezone = await getTimezone(data.timezone_id);
    return {
      meeting_dates: data.meeting_dates,
      start_time: data.start_time,
      end_time: data.end_time,
      timezone: timezone,
    };
  } catch (error) {
    console.error(error);
  }
};

export const getAllSchedules = async (id) => {
  try {
    const response = await axiosWH.get(`/meetings/${id}/schedule/all`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const createVoteForm = async (id, body) => {
  try {
    const response = await axiosWH.post(`/meetings/${id}/vote`, body);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getVoteChoices = async (id) => {
  try {
    const response = await axiosWH.get(`/meetings/${id}/vote`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const submitVotes = async (id, body) => {
  try {
    const response = await axiosWH.post(`/meetings/${id}/vote/choice`, body);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const editVotes = async (id, body) => {
  try {
    const response = await axiosWH.put(`/meetings/${id}/vote/choice`, body);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const closeVoteForm = async (id) => {
  try {
    const response = await axiosWH.patch(`/meetings/${id}/vote`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getMeetingInfo = async () => {
  try {
    const response = await axiosWH.get("/meetings");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
