import axios from "axios";

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
