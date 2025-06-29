import { NoitaHoliday } from './get-noita-holidays.tsx';
import {
  Card,
  NoitaTooltipWrapper,
} from '@noita-explorer/noita-component-library';
import { dateHelpers } from '@noita-explorer/tools';
import { Flex } from '@noita-explorer/react-utils';

export const HolidayCard = ({
  holiday,
  isHappeningNow,
}: {
  holiday: NoitaHoliday;
  isHappeningNow: boolean;
}) => {
  const isOneDayEvent =
    holiday.nextStartDate.getMonth() === holiday.nextEndDate.getMonth() &&
    holiday.nextStartDate.getDate() === holiday.nextEndDate.getDate();

  const now = new Date().getTime();
  const timeUntilNextStartDay = holiday.nextStartDate.getTime() - now;

  const timeLeftUntilEvent = isHappeningNow ? 0 : timeUntilNextStartDay;
  const daysLeftUntilEvent = dateHelpers.convert
    .milliSeconds(timeLeftUntilEvent)
    .toDays();

  return (
    <div style={{ width: '600px', maxWidth: '80%', marginBottom: 30 }}>
      <Flex center>
        <NoitaTooltipWrapper
          content={`${Math.ceil(daysLeftUntilEvent)} day${daysLeftUntilEvent > 1 ? 's' : ''} remaining`}
          isDisabled={isHappeningNow}
        >
          <span>
            {isHappeningNow && isOneDayEvent && 'Today'}
            {isHappeningNow && !isOneDayEvent && 'Now'}
            {!isHappeningNow && holiday.nextStartDate?.toLocaleDateString()} (
            {holiday.nextEndDate?.toLocaleDateString(undefined, {
              weekday: 'long',
            })}
            )
          </span>
          {!isOneDayEvent && (
            <>
              <span> - </span>
              <span>
                {holiday.nextEndDate?.toLocaleDateString()} (
                {holiday.nextEndDate?.toLocaleDateString(undefined, {
                  weekday: 'long',
                })}
                )
              </span>
            </>
          )}
        </NoitaTooltipWrapper>
      </Flex>
      {holiday.reactComponent ?? (
        <Card color={'gold'}>
          <div style={{ marginBottom: 15 }}>
            {holiday.title} - {holiday.datesText}
          </div>
          <div>{holiday.description}</div>
        </Card>
      )}
    </div>
  );
};
