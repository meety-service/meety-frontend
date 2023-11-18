import React from "react";
import { useParams } from "react-router";

const MeetingFillPage = () => {
  const { id } = useParams();

  return <div>Fill Meeting Form {id}</div>;
};

export default MeetingFillPage;
