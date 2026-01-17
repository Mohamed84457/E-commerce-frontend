export function Dateconvertfromiso(isodate) {
  // Ensure input is a string
  const isoStr = String(isodate);

  // Fix microseconds (6 digits) -> milliseconds (3 digits)
  const fixedIso = isoStr.replace(/\.\d{6}Z$/, "Z");

  // Create a Date object from UTC string
  const date = new Date(fixedIso);


  // Format to Egypt time (UTC+3)
  const options = {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const parts = new Intl.DateTimeFormat("en-GB", options).formatToParts(date);

  const year = parts.find(p => p.type === "year").value;
  const month = parts.find(p => p.type === "month").value;
  const day = parts.find(p => p.type === "day").value;
  const hour = parts.find(p => p.type === "hour").value;
  const minute = parts.find(p => p.type === "minute").value;
  const second = parts.find(p => p.type === "second").value;

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}


