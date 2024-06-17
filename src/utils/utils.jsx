export const isDateInPast = (date) => {
  var now = new Date();
  now.setHours(0, 0, 0, 0);
  return date < now;
};

export const sameDay = (d1, d2) => {
  if (d1 !== undefined && d2 !== undefined) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  } else {
    return false;
  }
};

export const convertToChileTime = (d) => {
  const localTime = d.getTime();
  const localOffset = d.getTimezoneOffset() * 60000;
  const utc = localTime + localOffset;
  const offset = -4; // UTC-4 to Chile
  return new Date(utc + 3600000 * offset);
};

export const fromDatetoYearMonthDay = (date) => {
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0")
  );
};

export function titleCase(str) {
  str = str.toLowerCase().split(" ");
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}

export const getDuplicates = (array, col) => {
  const arrayCol = array.map((item) => item[col]);
  const duplicates = array.filter(
    (item, index) => arrayCol.indexOf(item[col]) !== index
  );
  console.log("Duplicates ", duplicates);
  return duplicates;
};
