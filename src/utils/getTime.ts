function pad2(v: number) {
  return v < 10 ? `0${v}` : `${v}`;
}

export function getTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = pad2(now.getMonth() + 1);
  const date = pad2(now.getDate());
  const hour = pad2(now.getHours());
  const minute = pad2(now.getMinutes());
  const second = pad2(now.getSeconds());
  return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
}
