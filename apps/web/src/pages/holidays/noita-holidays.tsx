import { Card } from '@noita-explorer/noita-component-library';
import { Valentines } from '../../components/holidays/Valentines.tsx';
import { Easter } from '../../components/holidays/Easter.tsx';
import React from 'react';
import { TeamFortress2 } from '../../components/holidays/TeamFortress2.tsx';
import { Halloween } from '../../components/holidays/Halloween.tsx';
import { Winter } from '../../components/holidays/Winter.tsx';
import { Separator } from '../../components/Separator.tsx';
import { dateHelpers } from '@noita-explorer/tools';

export const NoitaHolidays = () => {
  const holidays: NoitaHoliday[] = getNoitaHolidays();
  const holidaysNow = holidays.filter(
    (h) => h.nextStartDate.getTime() > h.nextEndDate.getTime(),
  );
  const holidaysThisYear = holidays.filter(
    (h) =>
      h.nextStartDate.getTime() < h.nextEndDate.getTime() &&
      h.nextStartDate.getFullYear() === new Date().getFullYear(),
  );
  const holidaysNextYear = holidays.filter(
    (h) => h.nextStartDate.getFullYear() > new Date().getFullYear(),
  );

  return (
    <>
      <br />
      <br />
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
            {holidaysNow.map((holiday) => (
              <HolidayCard key={holiday.id} holiday={holiday} />
            ))}
            <div style={{ marginBottom: 30 }}></div>
          </>
        )}
        {holidaysThisYear.length > 0 && (
          <>
            <Separator>Upcoming this year</Separator>
            <div style={{ marginBottom: 30 }}></div>
            {holidaysThisYear.map((holiday) => (
              <HolidayCard key={holiday.id} holiday={holiday} />
            ))}
            <div style={{ marginBottom: 30 }}></div>
          </>
        )}
        {holidaysNextYear.length > 0 && (
          <>
            <Separator>Upcoming next year</Separator>
            <div style={{ marginBottom: 30 }}></div>
            {holidaysNextYear.map((holiday) => (
              <HolidayCard key={holiday.id} holiday={holiday} />
            ))}
          </>
        )}
      </div>
    </>
  );
};

const HolidayCard = ({ holiday }: { holiday: NoitaHoliday }) => {
  return (
    <div style={{ width: '600px', maxWidth: '80%', marginBottom: 30 }}>
      <div style={{ textAlign: 'center' }}>
        {holiday.nextStartDate?.toLocaleDateString()} -{' '}
        {holiday.nextEndDate?.toLocaleDateString()}
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

interface NoitaHoliday {
  id: string;
  title?: string;
  description?: string;
  datesText?: string;
  reactComponent?: React.ReactNode;
  nextStartDate: Date;
  nextEndDate: Date;
  durationDays?: number;
}

const getNoitaHolidays = (): NoitaHoliday[] => {
  return [
    {
      id: 'valentines',
      reactComponent: <Valentines />,
      nextStartDate: dateHelpers.getNextUpcomingDate(
        (year) => new Date(year, 1, 14),
      ),
      durationDays: 1,
    },
    {
      id: 'easter',
      reactComponent: <Easter />,
      nextStartDate: dateHelpers.getNextUpcomingDate((year) => {
        const easter = dateHelpers.calculateEaster(year);
        const sevenDaysBeforeEaster = new Date(
          year,
          easter.getMonth(),
          easter.getDate() - 7,
        );

        return sevenDaysBeforeEaster;
      }),
      nextEndDate: dateHelpers.getNextUpcomingDate((year) =>
        dateHelpers.calculateEaster(year),
      ),
      durationDays: 7,
    },
    {
      id: 'vappu',
      title: 'Vappu / Walpurgis Night',
      description:
        'Sima Potion Sima and Beer Potion Beer will replace 20% of potions.',
      datesText: '30 April – 1 May',
      nextStartDate: dateHelpers.getNextUpcomingDate(
        (year) => new Date(year, 3, 30),
      ),
      durationDays: 2,
    },
    {
      id: 'midsummer',
      title: 'Juhannus / Midsummer',
      description:
        'Tappurahiisi will be Effect drunk.png Drunk, beer bottles ("Kaljapullo") and drunk Hiisi will appear in the Hiisi Base and on the Lake island, the in-game time stays stuck on 12:00, Juhannussima Potion Juhannussima and Beer Potion Beer Potions replace regular spawns at a 9% chance.',
      datesText: 'Friday between June 19 and June 25',
      nextStartDate: dateHelpers.getNextUpcomingDate((year) => {
        const june19 = new Date(year, 5, 19);
        const june25 = new Date(year, 5, 25);
        return dateHelpers.getFirstDayOfWeek(5).between(june19, june25);
      }),
      durationDays: 1,
    },
    {
      id: 'tf2',
      reactComponent: <TeamFortress2 />,
      nextStartDate: dateHelpers.getNextUpcomingDate(
        (year) => new Date(year, 7, 24),
      ),
      durationDays: 1,
    },
    {
      id: 'halloween',
      reactComponent: <Halloween />,
      nextStartDate: dateHelpers.getNextUpcomingDate(
        (year) => new Date(year, 9, 31),
      ),
      durationDays: 1,
    },
    {
      id: 'winter',
      reactComponent: <Winter />,
      nextStartDate: dateHelpers.getNextUpcomingDate(
        (year) => new Date(year, 11, 1),
      ),
      nextEndDate: dateHelpers.getNextUpcomingDate(
        (year) => new Date(year, 2, 0, 23, 59, 59),
      ),
    },
    {
      id: 'christmas',
      title: 'Christmas',
      description:
        'Jouluhiisi will spawn (24th–26th). Kantele room grants wand tinkering effect (23rd–27th).',
      datesText: '23–27 December',
      nextStartDate: dateHelpers.getNextUpcomingDate(
        (year) => new Date(year, 11, 23),
      ),
      durationDays: 5,
    },
    {
      id: 'new_years',
      title: 'New Years',
      description:
        'Powerful Firework launching boxes, Pata, will rarely spawn at the Forest start location. It has a 12.5% chance to appear.',
      datesText: '30 December – 2 January',
      nextStartDate: dateHelpers.getNextUpcomingDate(
        (year) => new Date(year, 11, 30),
      ),
      durationDays: 4,
    },
  ].map((holiday) => {
    const nextStartDate = holiday.nextStartDate;
    if (!nextStartDate)
      throw new Error(`Holiday ${holiday.title} does not have a start date`);
    // calculate the next end day

    const nextEndDate =
      holiday.nextEndDate ??
      dateHelpers.getNextUpcomingDate((year) => {
        const duration = holiday.durationDays ?? 1;
        return new Date(
          year,
          nextStartDate.getMonth(),
          nextStartDate.getDate() + duration - 1,
          23,
          59,
          59,
        );
      });

    return {
      ...holiday,
      nextEndDate: nextEndDate,
    } as NoitaHoliday;
  });
};
