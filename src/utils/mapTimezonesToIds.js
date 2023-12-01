import timezones from "./timezone.js";

export const mapTimezonesToIds = () => {
  const timezoneIds = timezones.reduce((acc, timezone, index) => {
    acc[timezone] = index + 1;
    return acc;
  }, {});

  return timezoneIds;
};
