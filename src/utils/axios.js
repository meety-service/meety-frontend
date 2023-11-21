import axios from "axios";

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
