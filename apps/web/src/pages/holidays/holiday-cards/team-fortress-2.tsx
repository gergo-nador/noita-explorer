import { Card } from '@noita-explorer/noita-component-library';

export const TeamFortress2 = () => {
  return (
    <Card
      styling={{
        borderDark: '#ba4b20',
        borderBright: '#ba4b20',
        background: 'linear-gradient(to top, #ba4b20, #000)',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
        <div>
          <div style={{ marginBottom: 15 }}>
            <span className='text-xl'>Team Fortress's birthday</span>
            <span className='text-secondary text-xl'> - 24 August</span>
          </div>
          <div>
            A variant of Snipuhiisi will rarely spawn in the Snowy Depths and
            Meat Realm that throws jars of Urine instead of shooting bullets. (A
            reference to Jarate in that game)
          </div>
        </div>
        <div>
          <img
            src='/images/holidays/team-fortress-2.webp'
            alt='Team Fortress 2 Gunner'
            width='150px'
            height='auto'
          />
        </div>
      </div>
    </Card>
  );
};
