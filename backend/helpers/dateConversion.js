export function getEpochMsFromXAmzDate(xAmzDate) {
    const year = parseInt(xAmzDate.slice(0, 4), 10);
    const month = parseInt(xAmzDate.slice(4, 6), 10) - 1;
    const day = parseInt(xAmzDate.slice(6, 8), 10);
    const hour = parseInt(xAmzDate.slice(9, 11), 10);
    const minute = parseInt(xAmzDate.slice(11, 13), 10);
    const second = parseInt(xAmzDate.slice(13, 15), 10);
    return Date.UTC(year, month, day, hour, minute, second);
  }
