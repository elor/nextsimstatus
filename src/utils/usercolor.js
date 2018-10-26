import md5 from "./md5";

const colors = {
  blue: "#03a9f4",
  green: "#4caf50",
  red: "#f44336"
};

const mapping = {
  free: colors.green,
  error: colors.red,
  err: colors.red,
  alloc: colors.blue
};

export default function usercolor(name) {
  if (mapping[name.toLowerCase()]) {
    return mapping[name.toLowerCase()];
  }

  const hash = md5(name + md5(name)).substr(19, 6);
  return `#${hash}`;
}
