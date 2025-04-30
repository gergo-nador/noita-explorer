import { Card } from '@noita-explorer/noita-component-library';
import { Separator } from '../../components/Separator.tsx';
import { getNoitaHolidays, NoitaHoliday } from './get-noita-holidays.tsx';

export const NoitaHolidays = () => {
  const holidays = getNoitaHolidays();
  const holidaysNow = holidays.filter((h) => h.isHappeningNow);
  const holidaysThisYear = holidays.filter(
    (h) => h.isThisYear && !h.isHappeningNow,
  );
  const holidaysNextYear = holidays.filter((h) => h.isNextYear);

  return (
    <>
      <br />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        {holidaysNow.length > 0 && (
          <>
            <Separator>Now</Separator>
            <div style={{ marginBottom: 30 }}></div>
            {holidaysNow.map((holidayWrapper) => (
              <HolidayCard
                key={holidayWrapper.holiday.id}
                holiday={holidayWrapper.holiday}
                isHappeningNow={holidayWrapper.isHappeningNow}
              />
            ))}
            <div style={{ marginBottom: 30 }}></div>
          </>
        )}
        {holidaysThisYear.length > 0 && (
          <>
            <Separator>Upcoming this year</Separator>
            <div style={{ marginBottom: 30 }}></div>
            {holidaysThisYear.map((holidayWrapper) => (
              <HolidayCard
                key={holidayWrapper.holiday.id}
                holiday={holidayWrapper.holiday}
                isHappeningNow={holidayWrapper.isHappeningNow}
              />
            ))}
            <div style={{ marginBottom: 30 }}></div>
          </>
        )}
        {holidaysNextYear.length > 0 && (
          <>
            <Separator>Upcoming next year</Separator>
            <div style={{ marginBottom: 30 }}></div>
            {holidaysNextYear.map((holidayWrapper) => (
              <HolidayCard
                key={holidayWrapper.holiday.id}
                holiday={holidayWrapper.holiday}
                isHappeningNow={holidayWrapper.isHappeningNow}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};

const HolidayCard = ({
  holiday,
  isHappeningNow,
}: {
  holiday: NoitaHoliday;
  isHappeningNow: boolean;
}) => {
  const isOneDayEvent =
    holiday.nextStartDate.getMonth() === holiday.nextEndDate.getMonth() &&
    holiday.nextStartDate.getDate() === holiday.nextEndDate.getDate();

  return (
    <div style={{ width: '600px', maxWidth: '80%', marginBottom: 30 }}>
      <div style={{ textAlign: 'center' }}>
        {(!isOneDayEvent || isHappeningNow) && (
          <>
            <span>
              {isHappeningNow
                ? 'Now'
                : holiday.nextStartDate?.toLocaleDateString()}
            </span>
            <span> - </span>
          </>
        )}
        <span>{holiday.nextEndDate?.toLocaleDateString()}</span>
      </div>
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
