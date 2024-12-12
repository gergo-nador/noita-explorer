import {
  ActiveProgressIcon,
  Button,
  ProgressIcon,
  TabView,
} from '@noita-explorer/noita-component-library';
import { useNoitaDataWakStore } from '../stores/NoitaDataWak';
import { NoitaProgressIconTable } from '../components/NoitaProgressIconTable';
import { useNavigate } from 'react-router-dom';
import { pages } from '../routes/pages';

export const ProgressPageV2 = () => {
  const { data } = useNoitaDataWakStore();
  const navigate = useNavigate();

  return (
    <TabView
      tabs={[
        {
          title: 'Perks',
          content: (
            <div>
              <Button onClick={() => navigate(pages.main)}>Back</Button>
              <NoitaProgressIconTable
                data={data.spells}
                name={'Spells'}
                columnCount={9}
              >
                {data.perks.map((perk) => (
                  <ActiveProgressIcon
                    id={'perk-' + perk.id}
                    key={'perk-' + perk.id}
                    tooltip={
                      <div>
                        <div style={{ fontSize: 20 }}>{perk.name}</div>
                      </div>
                    }
                  >
                    <ProgressIcon type={'regular'} icon={perk.imageBase64} />
                  </ActiveProgressIcon>
                ))}
              </NoitaProgressIconTable>
            </div>
          ),
        },
        {
          title: 'Spells',
          content: (
            <NoitaProgressIconTable
              data={data.spells}
              name={'Spells'}
              columnCount={12}
            >
              {data.spells.map((spell) => (
                <ActiveProgressIcon
                  id={'spell-' + spell.id}
                  key={'spell-' + spell.id}
                  tooltip={
                    <div>
                      <div style={{ fontSize: 20 }}>{spell.name}</div>
                    </div>
                  }
                >
                  <ProgressIcon
                    type={'regular'}
                    icon={spell.imageBase64}
                    spellItemTypeId={spell.type}
                  />
                </ActiveProgressIcon>
              ))}
            </NoitaProgressIconTable>
          ),
        },
        {
          title: 'Enemies',
          content: (
            <NoitaProgressIconTable
              data={data.spells}
              name={'Spells'}
              columnCount={9}
            >
              {data.enemies.map((enemy) => (
                <ActiveProgressIcon
                  id={'enemy-' + enemy.id}
                  key={'enemy-' + enemy.id}
                  tooltip={
                    <div>
                      <div style={{ fontSize: 20 }}>{enemy.name}</div>
                      <div>{enemy.id}</div>
                    </div>
                  }
                >
                  <ProgressIcon type={'regular'} icon={enemy.imageBase64} />
                </ActiveProgressIcon>
              ))}
            </NoitaProgressIconTable>
          ),
        },
      ]}
    />
  );
};
