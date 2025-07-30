import { Separator } from '@noita-explorer/react-utils';
import { getNoitaHolidays } from './get-noita-holidays.tsx';
import { Flex } from '@noita-explorer/react-utils';
import { HolidayCard } from './holiday-card.tsx';
import { NoitaHolidayContext } from '../../contexts/noita-holiday-context.ts';
import { useFireworkComponent } from '../../hooks/use-firework-component.tsx';
import { ZIndexManager } from '../../utils/z-index-manager.ts';

export const NoitaHolidays = () => {
  const holidays = getNoitaHolidays();
  const holidaysNow = holidays.filter((h) => h.isHappeningNow);
  const holidaysThisYear = holidays.filter(
    (h) => h.isThisYear && !h.isHappeningNow,
  );
  const holidaysNextYear = holidays.filter((h) => h.isNextYear);
  const { fireFireworks, FireworkBackground } = useFireworkComponent();

  return (
    <NoitaHolidayContext.Provider value={{ fireFireworks: fireFireworks }}>
      <div
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          zIndex: ZIndexManager.holidayFireworkBackground,
        }}
      >
        <FireworkBackground />
      </div>
      <br />

      <Flex justify='center' align='center' direction='column'>
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
      </Flex>
    </NoitaHolidayContext.Provider>
  );
};
