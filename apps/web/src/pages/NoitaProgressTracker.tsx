/*
import {
  ActiveProgressIcon,
  Button,
  ProgressIcon,
} from '@noita-explorer/noita-component-library';
import { useNavigate } from 'react-router-dom';
import { pages } from '../routes/pages';
import { useEffect } from 'react';
import { PageBaseCard } from '../components/PageBaseCard';
import { useNoitaDataWakStore } from '../stores/NoitaDataWak';
import { NoitaProgressIconTable } from '../components/NoitaProgressIconTable';
import { NoitaSpellTooltip } from '../components/NoitaSpellTooltip';
import { NoitaPerkTooltip } from '../components/NoitaPerkTooltip';
import { useSave00Store } from '../stores/save00';
import { Flex } from '../components/Flex';

export const NoitaProgressTracker = () => {
  const navigate = useNavigate();
  const { data } = useNoitaDataWakStore();
  const { enemyStatistics, unlockedPerks, unlockedSpells, reload } =
    useSave00Store();

  useEffect(() => {
    reload();
  }, []);

  return (
    <PageBaseCard style={{ width: '95%' }}>
      <div>Progress tracker</div>

      <Button onClick={() => navigate(pages.main)}>Back</Button>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '9fr 12fr 9fr',
          gap: 10,
        }}
      >
        <NoitaProgressIconTable
          data={data.perks}
          name={'Perks'}
          columnCount={9}
          unlocked={unlockedPerks?.length ?? 0}
        >
          {data.perks.map((perk) => (
            <ActiveProgressIcon
              id={'perk-' + perk.id}
              key={'perk-' + perk.id}
              tooltip={<NoitaPerkTooltip perk={perk} />}
            >
              <ProgressIcon
                type={
                  unlockedPerks && unlockedPerks.includes(perk.id)
                    ? 'regular'
                    : 'unknown'
                }
                icon={perk.imageBase64}
              />
            </ActiveProgressIcon>
          ))}
        </NoitaProgressIconTable>
        <NoitaProgressIconTable
          data={data.spells}
          name={'Spells'}
          columnCount={12}
          unlocked={unlockedSpells?.length ?? 0}
        >
          {data.spells.map((spell) => (
            <ActiveProgressIcon
              id={'spell-' + spell.id}
              key={'spell-' + spell.id}
              tooltip={
                <NoitaSpellTooltip
                  spell={spell}
                  isUnknown={
                    !unlockedSpells || !unlockedSpells.includes(spell.id)
                  }
                />
              }
            >
              <ProgressIcon
                type={
                  unlockedSpells && unlockedSpells.includes(spell.id)
                    ? 'regular'
                    : 'unknown'
                }
                icon={spell.imageBase64}
                spellItemTypeId={spell.type}
              />
            </ActiveProgressIcon>
          ))}
        </NoitaProgressIconTable>
        <NoitaProgressIconTable
          data={data.enemies}
          name={'Enemies'}
          columnCount={9}
          unlocked={0}
        >
          {data.enemies.map((enemy) => (
            <ActiveProgressIcon
              id={'enemy-' + enemy.id}
              key={'enemy-' + enemy.id}
              tooltip={
                <div>
                  <div style={{ fontSize: 20 }}>{enemy.name}</div>
                  {enemyStatistics && enemy.id in enemyStatistics && (
                    <div>
                      <Flex gap={10}>
                        <div>Kills</div>
                        <div>
                          {enemyStatistics[enemy.id].enemyDeathByPlayer}
                        </div>
                      </Flex>
                      <Flex gap={10}>
                        <div>Killed By</div>
                        <div>
                          {enemyStatistics[enemy.id].playerDeathByEnemy}
                        </div>
                      </Flex>
                    </div>
                  )}
                </div>
              }
            >
              <ProgressIcon
                type={
                  enemyStatistics && enemy.id in enemyStatistics
                    ? 'regular'
                    : 'unknown'
                }
                icon={enemy.imageBase64}
              />
            </ActiveProgressIcon>
          ))}
        </NoitaProgressIconTable>
      </div>
    </PageBaseCard>
  );
};
*/
