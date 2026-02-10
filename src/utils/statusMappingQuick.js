import { STATUS_TO_ENUM } from "./statusMapper";

export const mapStatusToEnumQuick = (status) => {
  if (status === null || status === undefined) return null;
  if (typeof status === "number") return status;

  const mapped = STATUS_TO_ENUM[status];
  return typeof mapped === "number" ? mapped : null;
};

export const mapStatusEnumToStringQuick = (statusEnum) => {
  switch (statusEnum) {
    case 0:
      return "Backlog";
    case 1:
      return "Playing";
    case 2:
      return "Paused";
    case 3:
      return "Dropped";
    case 4:
      return "Completed";
    default:
      return "Backlog";
  }
};
