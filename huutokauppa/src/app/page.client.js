"use client";
import { duration } from "@mui/material";
import { interval } from "date-fns";
import { useEffect } from "react";
import { msToDHMS } from "@/helperFunctions/Time";
export default function Page() {
  useEffect(() => {
    const endTimeButtonElements =
      document.getElementsByClassName("endTimeButton");
    Array.from(endTimeButtonElements).forEach((e) => {
      var durationMS = e.innerHTML;

      var interval = setInterval(() => {
        durationMS -= 1000;
        if (durationMS > 0 ){
          const TimeDHMS = msToDHMS(durationMS);
          const days = TimeDHMS.days > 0 ? `${TimeDHMS.days}:` : ""
          const hours = TimeDHMS.hours > 0 ? `${TimeDHMS.hours}:` : ""
          const minutes = TimeDHMS.minutes > 0 ? `${TimeDHMS.minutes}:` : ""
          var timeFormatted = `${days}${hours}${minutes}${TimeDHMS.seconds}`;
          e.style.display = "inline-flex"
          e.innerHTML = timeFormatted;
        } else {
          e.style.display = "inline-flex"
          e.remove()
          clearInterval(interval)
          
          
        }
      }, 1000);
    });
  });
  return <div></div>;
}
