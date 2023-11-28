import axios from "axios";
import { getCookie } from "./cookie";

// axios에 해더 정보를 미리 저장
export const axiosWH = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Cookie: `${process.env.REACT_APP_USER_TOKEN}=${getCookie(
      process.env.REACT_APP_USER_TOKEN
    )};`,
  },
  withCredentials: true,
  responseType: "json",
});

export const getTimezone = async (timezone_id, handleError) => {
  return await axiosWH
    .get("/timezones")
    .then(
      (response) =>
        response.data.find((timezone) => timezone.id === timezone_id).name
    )
    .catch(function (error) {
      handleError(error);
    });
};

export const getMeetingForm = async (id, handleError) => {
  return await axiosWH
    .get(`/meetings/${id}`)
    .then(async (response) => {
      const data = response.data;
      const timezone = await getTimezone(data.timezone_id, handleError);
      return {
        // available_date를 기준으로 오름차순 정렬한다.
        meeting_dates: data.meeting_dates.sort((a, b) => {
          const dateA = new Date(a.available_date);
          const dateB = new Date(b.available_date);
          return dateA - dateB;
        }),
        start_time: data.start_time,
        end_time: data.end_time,
        timezone: timezone,
      };
    })
    .catch(function (error) {
      handleError(error);
    });
};

export const submitSchedules = async (id, body, handleError) => {
  return await axiosWH
    .post(`/meetings/${id}/schedule`, body)
    .then((response) => response.data)
    .catch(function (error) {
      handleError(error);
    });
};

export const editSchedules = async (id, body, handleError) => {
  return await axiosWH
    .put(`/meetings/${id}/schedule`, body)
    .then((response) => response.data)
    .catch(function (error) {
      handleError(error);
    });
};

export const getMySchedules = async (id, handleError, isModifying = false) => {
  return await axiosWH
    .get(`/meetings/${id}/schedule`)
    .then((response) => response.data)
    .catch(function (error) {
      if (!isModifying) {
        handleError(error);
      } else {
        null
      }
    });
};

export const getAllSchedules = async (id, handleError) => {
  return await axiosWH
    .get(`/meetings/${id}/schedule/all`)
    .then((response) => response.data)
    .catch(function (error) {
      handleError(error);
    });
};

export const createVoteForm = async (id, body, handleError) => {
  return await axiosWH
    .post(`/meetings/${id}/vote`, body)
    .then((response) => response.data)
    .catch(function (error) {
      handleError(error);
    });
};

export const getVoteChoices = async (id, handleError) => {
  return await axiosWH
    .get(`/meetings/${id}/vote`)
    .then((response) => response.data)
    .catch(function (error) {
      handleError(error);
    });
};

export const submitVotes = async (id, body, handleError) => {
  return await axiosWH
    .post(`/meetings/${id}/vote/choice`, body)
    .then((response) => response.data)
    .catch(function (error) {
      handleError(error);
    });
};

export const editVotes = async (id, body, handleError) => {
  return await axiosWH
    .put(`/meetings/${id}/vote/choice`, body)
    .then((response) => response.data)
    .catch(function (error) {
      handleError(error);
    });
};

export const closeVoteForm = async (id, handleError) => {
  const data = {"close": 1}
  return await axiosWH
    .patch(`/meetings/${id}/vote`, data)
    .then((response) => response.data)
    .catch(function (error) {
      handleError(error);
    });
};

export const getMeetingInfo = async (handleError) => {
  return await axiosWH
    .get("/meetings")
    .then((response) => response.data)
    .catch(function (error) {
      handleError(error);
    });
};
