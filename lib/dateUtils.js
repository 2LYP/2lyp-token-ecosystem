/**
 * Utility functions for consistent date formatting across client and server
 */

export const formatDate = (timestamp) => {
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    // Use a consistent format that works on both server and client
    const options = {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC' // Use UTC to avoid timezone differences between server/client
    };
    
    return date.toLocaleString('en-US', options);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

export const formatRelativeTime = (timestamp) => {
  try {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return 'Recently';
  }
};

export const createConsistentTimestamp = (baseTime = 1725446400000, offsetHours = 0) => {
  return baseTime + (offsetHours * 60 * 60 * 1000);
};
