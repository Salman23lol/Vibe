export const FormatUTC = (utcDateString) => {
    const now = new Date();
    const date = new Date(utcDateString);
    const seconds = Math.floor((now - date) / 1000);
  
    const intervals = [
      { label: 'y', seconds: 31536000 }, // Seconds in a year
      { label: 'mo', seconds: 2592000 }, // Seconds in a month
      { label: 'd', seconds: 86400 },    // Seconds in a day
      { label: 'h', seconds: 3600 },     // Seconds in an hour
      { label: 'm', seconds: 60 },       // Seconds in a minute
    ];
  
    for (let i = 0; i < intervals.length; i++) {
      const interval = Math.floor(seconds / intervals[i].seconds);
      if (interval >= 1) {
        return `${interval}${intervals[i].label} ago`;
      }
    }
  
    return `${Math.floor(seconds)}s ago`;
  };