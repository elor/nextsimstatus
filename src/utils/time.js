function appendTimeValue(string, value, singular, plural) {
  switch (value) {
    case 0:
      return string;
    case 1:
      return `${string}, ${value} ${singular}`;
    default:
      return `${string}, ${value} ${plural}`;
  }
}

export function format(seconds) {
  seconds = Math.floor(seconds);
  let minutes = Math.floor(seconds / 60) % 60;
  let hours = Math.floor(seconds / 3600) % 60;
  let days = Math.floor(seconds / 86400);

  let string = "";
  string = appendTimeValue(string, days, "day", "days");
  string = appendTimeValue(string, hours, "hour", "hours");
  string = appendTimeValue(string, minutes, "minute", "minutes");

  return string.replace(/^\s*,?\s*|,?\s*$/g, "");
}
