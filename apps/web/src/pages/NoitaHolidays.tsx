import { Card } from '@noita-explorer/noita-component-library';
import { Valentines } from '../components/holidays/Valentines';
import { Easter } from '../components/holidays/Easter';
import React from 'react';
import { TeamFortress2 } from '../components/holidays/TeamFortress2';
import { Halloween } from '../components/holidays/Halloween';
import { Winter } from '../components/holidays/Winter';

export const NoitaHolidays = () => {
  const holidays: NoitaHoliday[] = [
    {
      id: 'valentines',
      reactComponent: <Valentines />,
    },
    {
      id: 'easter',
      reactComponent: <Easter />,
    },
    {
      id: 'vappu',
      title: 'Vappu / Walpurgis Night',
      description:
        'Sima Potion Sima and Beer Potion Beer will replace 20% of potions.',
      datesText: '30 April – 1 May',
    },
    {
      id: 'midsummer',
      title: 'Juhannus / Midsummer',
      description:
        'Tappurahiisi will be Effect drunk.png Drunk, beer bottles ("Kaljapullo") and drunk Hiisi will appear in the Hiisi Base and on the Lake island, the in-game time stays stuck on 12:00, Juhannussima Potion Juhannussima and Beer Potion Beer Potions replace regular spawns at a 9% chance.',
      datesText: 'Friday between June 19 and June 25',
    },
    {
      id: 'tf2',
      reactComponent: <TeamFortress2 />,
    },
    {
      id: 'halloween',
      reactComponent: <Halloween />,
    },
    {
      id: 'winter',
      reactComponent: <Winter />,
    },
    {
      id: 'christmas',
      title: 'Christmas',
      description:
        'Jouluhiisi will spawn (24th–26th). Kantele room grants wand tinkering effect (23rd–27th).',
      datesText: '23–27 December',
    },
    {
      id: 'new_years',
      title: 'New Years',
      description:
        'Powerful Firework launching boxes, Pata (listen Audio.svg), will rarely spawn at the Forest start location. It has a 12.5% chance to appear.',
      datesText: '30 December – 2 January',
    },
  ];
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
        {holidays.map((holiday) => (
          <div style={{ width: '600px', maxWidth: '80%', marginBottom: 30 }}>
            {holiday.reactComponent ?? (
              <Card color={'gold'}>
                <div style={{ marginBottom: 15 }}>
                  {holiday.title} - {holiday.datesText}
                </div>
                <div>{holiday.description}</div>
              </Card>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

interface NoitaHoliday {
  id: string;
  title?: string;
  description?: string;
  datesText?: string;
  reactComponent?: React.ReactNode;
}
