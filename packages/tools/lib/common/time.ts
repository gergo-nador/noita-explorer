import { floor } from './math';

export const milliSecondsToTimeString = (ms: number) => {
  const totalSeconds = floor(ms / 1000);
  const seconds = totalSeconds % 60;

  const totalMinutes = floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;

  if (totalMinutes < 60) {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  const totalHours = floor(totalMinutes / 60);
  const hours = totalHours % 24;

  if (totalHours < 24) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  const totalDays = floor(totalHours / 24);
  return `${totalDays} days ${hours} hours`;
};

export const secondsToTimeString = (seconds: number) =>
  milliSecondsToTimeString(seconds * 1000);
