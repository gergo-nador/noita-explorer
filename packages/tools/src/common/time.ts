import { mathHelpers } from './math';

const milliSecondsToTimeString = (ms: number) => {
  const totalSeconds = mathHelpers.floor(ms / 1000);
  const seconds = totalSeconds % 60;

  const totalMinutes = mathHelpers.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;

  if (totalMinutes < 60) {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  const totalHours = mathHelpers.floor(totalMinutes / 60);
  const hours = totalHours % 24;

  if (totalHours < 24) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  const totalDays = mathHelpers.floor(totalHours / 24);
  return `${totalDays} d ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const secondsToTimeString = (seconds: number) =>
  milliSecondsToTimeString(seconds * 1000);

export const timeHelpers = {
  secondsToTimeString: secondsToTimeString,
  milliSecondsToTimeString: milliSecondsToTimeString,
};
