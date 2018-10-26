import md5 from "./md5";

export default function usercolor(name) {
  const hash = md5(name + md5(name)).substr(19, 6);
  return `#${hash}`;
}
