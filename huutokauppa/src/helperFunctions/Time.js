  // runs every 1 second and updates remaining time on products
  export const reduceTime = () => {
    const endTimeButtons = document.getElementsByClassName(endTimeButton);
    endTimeButtons.forEach((Element) => {
      console.log(Element.value);
    });
  }

  export const msToDHMS = (ms) => {
    const totalSeconds = ms / 1000;
    let remaining = totalSeconds;
    const days = Math.floor(remaining / (3600 * 24));
    remaining %= 3600 * 24;
    const hours = Math.floor(remaining / 3600);
    remaining %= 3600;
    const minutes = Math.floor(remaining / 60);
    const seconds = Math.floor(remaining % 60);
    return {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };

  
  }