import React, { useMemo } from 'react';
import { useNoitaDataWakStore } from '../../../stores/noita-data-wak.ts';
import { arrayHelpers } from '@noita-explorer/tools';
import { useSave00Store } from '../../../stores/save00.ts';
import { StringKeyDictionary } from '@noita-explorer/model';
import { AchievementPerk } from './achievement-perk.ts';
import { ObtainPerksAchievement } from './achievements/obtain-perks-achievement.tsx';
import { HaloTransformationAchievement } from './achievements/halo-transformation-achievement.tsx';

interface NoitaPillar {
  img: string;
  title?: string;
  flag?: string;
  info?: React.ReactNode;
}

// lua script: data/scripts/biomes/mountain_tree.lua
export const useNoitaProgressTrackerPillarDefinitions = (): NoitaPillar[][] => {
  const { data } = useNoitaDataWakStore();
  const { currentRun } = useSave00Store();

  const perks: StringKeyDictionary<AchievementPerk> = useMemo(() => {
    if (!data?.perks) {
      return {};
    }

    const perkData = data.perks.map((perk) => {
      const pickedPerk = currentRun?.worldState.perks.pickedPerks.find(
        (p) => p.perkId === perk.id,
      );

      return { id: perk.id, perk: perk, count: pickedPerk?.count };
    });

    return arrayHelpers.asDict(perkData, (p) => p.id);
  }, [data?.perks, currentRun?.worldState.perks.pickedPerks]);

  const pillar1: NoitaPillar[] = [
    { img: 'pillar_end_01' },

    // Transformations
    {
      img: 'pillar_part_phalo',
      title: 'Halo Transformation',
      flag: 'player_status_halo',
      info: <HaloTransformationAchievement perks={perks} />,
    },
    {
      img: 'pillar_part_plukki',
      title: 'Lukki Transformation',
      flag: 'player_status_lukky',
      info: (
        <ObtainPerksAchievement
          title='Lukki Transformation'
          perks={perks}
          perksToObtain={[
            { id: 'lukki_minion', amount: 1 },
            { id: 'attack_foot', amount: 2 },
            { id: 'leggy_feet', amount: 2 },
          ]}
        />
      ),
    },
    {
      img: 'pillar_part_pfungi',
      title: 'Funky Transformation',
      flag: 'player_status_funky',
      info: (
        <ObtainPerksAchievement
          title='Funky Transformation'
          perks={perks}
          perksToObtain={[
            { id: 'cordyceps', amount: 1 },
            { id: 'mold', amount: 1 },
            { id: 'fungal_disease', amount: 1 },
          ]}
        />
      ),
    },
    {
      img: 'pillar_part_prat',
      title: 'Ratty Transformation',
      flag: 'player_status_ratty',
      info: (
        <ObtainPerksAchievement
          title='Ratty Transformation'
          perks={perks}
          perksToObtain={[
            { id: 'plague_rats', amount: 1 },
            { id: 'revenge_rats', amount: 1 },
            { id: 'vomit_rats', amount: 1 },
          ]}
        />
      ),
    },
    {
      img: 'pillar_part_pghost',
      title: 'Ghostly Transformation',
      flag: 'player_status_ghostly',
      info: (
        <ObtainPerksAchievement
          title='Ghostly Transformation'
          perks={perks}
          perksToObtain={[
            { id: 'hungry_ghost', amount: 1 },
            { id: 'angry_ghost', amount: 1 },
            { id: 'death_ghost', amount: 1 },
          ]}
        />
      ),
    },

    // Tower
    { img: 'pillar_part_secrett', title: 'Tower', flag: 'secret_tower' },

    // Sacrifice
    {
      img: 'pillar_part_dseffect',
      title: 'Sacrifice Dark Sun Rock',
      flag: 'misc_darksun_effect',
    },
    {
      img: 'pillar_part_seffect',
      title: 'Sacrifice Sun Rock',
      flag: 'misc_sun_effect',
    },
    {
      img: 'pillar_part_mbots',
      title: 'Sacrifice Monk Statue',
      flag: 'misc_monk_bots',
    },
    {
      img: 'pillar_part_mrain',
      title: 'Sacrifice Henkevä potu',
      flag: 'misc_mimic_potion_rain',
    },
    {
      img: 'pillar_part_train',
      title: 'Sacrifice Tablets',
      flag: 'misc_altar_tablet',
    },
    {
      img: 'pillar_part_grain',
      title: 'Sacrifice Greed Curse',
      flag: 'misc_greed_rain',
    },
    {
      img: 'pillar_part_wrain',
      title: 'Sacrifice Worm Crystal',
      flag: 'misc_worm_rain',
    },
    {
      img: 'pillar_part_urain',
      title: 'Sacrifice Utility Box',
      flag: 'misc_util_rain',
    },
    {
      img: 'pillar_part_crain',
      title: 'Sacrifice Chest',
      flag: 'misc_chest_rain',
    },
  ];

  const pillar2: NoitaPillar[] = [
    { img: 'pillar_end_03' },

    // As Above, So Below
    {
      img: 'pillar_part_dsunmoon',
      title: 'As Above, So Below (Dark)',
      flag: 'secret_darksun_collision',
    },
    {
      img: 'pillar_part_sunmoon',
      title: 'As Above, So Below',
      flag: 'secret_sun_collision',
    },

    // Dark Moon
    { img: 'pillar_part_dmoong', title: 'Dark Gourd Moon', flag: 'dead_mood' },
    { img: 'pillar_part_dmoon', title: 'Blood Moon', flag: 'secret_dmoon' },

    // Moon
    { img: 'pillar_part_moong', title: 'Gourd Moon', flag: 'special_mood' },
    { img: 'pillar_part_moona', title: 'Drunk Moon', flag: 'secret_moon2' },
    { img: 'pillar_part_moon', title: 'Moon', flag: 'secret_moon' },

    // Essences
    {
      img: 'pillar_part_essenceal',
      title: 'Essence of Spirits',
      flag: 'essence_alcohol',
    },
    {
      img: 'pillar_part_essencea',
      title: 'Essence of Air',
      flag: 'essence_air',
    },
    {
      img: 'pillar_part_essencee',
      title: 'Essence of Earth',
      flag: 'essence_laser',
    },
    {
      img: 'pillar_part_essencew',
      title: 'Essence of Water',
      flag: 'essence_water',
    },
    {
      img: 'pillar_part_essencef',
      title: 'Essence of Fire',
      flag: 'essence_fire',
    },
  ];

  const pillar3: NoitaPillar[] = [
    { img: 'pillar_end_06' },

    { img: 'pillar_part_endn', title: 'Nightmare', flag: 'progress_nightmare' },
    {
      img: 'pillar_part_endp',
      title: 'New Game+++',
      flag: 'progress_newgameplusplus3',
    },
    {
      img: 'pillar_part_endg',
      title: 'Peaceful Ending',
      flag: 'progress_ending2',
    },
    {
      img: 'pillar_part_endb',
      title: 'Mountain Ending (Pure)',
      flag: 'progress_ending1_gold',
    },
    {
      img: 'pillar_part_endt',
      title: 'Mountain Ending (Toxic)',
      flag: 'progress_ending1_toxic',
    },
    {
      img: 'pillar_part_end0',
      title: 'Normal Ending',
      flag: 'progress_ending0',
    },
  ];

  const pillar4: NoitaPillar[] = [
    { img: 'pillar_end_02' },

    { img: 'pillar_part_boss', title: 'Kolmisilmä', flag: 'boss_centipede' },
    { img: 'pillar_part_minisky', title: 'Kivi', flag: 'miniboss_sky' },
    { img: 'pillar_part_yeah3', title: 'Toveri', flag: 'final_secret_orb3' },
    {
      img: 'pillar_part_minigm',
      title: 'Gate Guardian',
      flag: 'miniboss_gate_monsters',
    },
    {
      img: 'pillar_part_threelk',
      title: "Tapio's Wrath",
      flag: 'miniboss_threelk',
      info: (
        <div>
          <div>Tapio's Wrath</div>
          <div>
            Helpless Kills: {currentRun?.worldState.helplessKills ?? 0} / 300
          </div>
        </div>
      ),
    },
    {
      img: 'pillar_part_elk',
      title: 'Tapion Vasalli',
      flag: 'miniboss_islandspirit',
    },
    { img: 'pillar_part_fish', title: 'Syväolento', flag: 'miniboss_fish' },
    { img: 'pillar_part_maggot', title: 'Limatoukka', flag: 'miniboss_maggot' },
    {
      img: 'pillar_part_meme',
      title: 'Mestarien mestari',
      flag: 'miniboss_wizard',
    },
    {
      img: 'pillar_part_minir',
      title: 'Kolmisilmän silmä',
      flag: 'miniboss_robot',
    },
    {
      img: 'pillar_part_minia',
      title: 'Ylialkemisti',
      flag: 'miniboss_alchemist',
    },
    {
      img: 'pillar_part_minip',
      title: 'Sauvojen tuntija',
      flag: 'miniboss_pit',
    },
    { img: 'pillar_part_minigh', title: 'Unohdettu', flag: 'miniboss_ghost' },
    {
      img: 'pillar_part_meat',
      title: 'Kolmisilmän sydän',
      flag: 'miniboss_meat',
    },
    {
      img: 'pillar_part_minil',
      title: 'Kolmisilmän koipi',
      flag: 'miniboss_limbs',
    },
    { img: 'pillar_part_minid', title: 'Suomuhauki', flag: 'miniboss_dragon' },
  ];

  const pillar5: NoitaPillar[] = [
    { img: 'pillar_end_05' },

    // Sun
    { img: 'pillar_part_col', title: 'Supernova', flag: 'secret_supernova' },
    {
      img: 'pillar_part_sunkill',
      title: 'Benign Sunshine!',
      flag: 'progress_sunkill',
    },
    {
      img: 'pillar_part_dsun',
      title: 'Pimeä Aurinko',
      flag: 'progress_darksun',
    },
    { img: 'pillar_part_sun', title: 'Uusi Aurinko', flag: 'progress_sun' },

    // High Effort Challanges
    { img: 'pillar_part_nohit', title: 'Undamaged', flag: 'progress_nohit' },
    { img: 'pillar_part_minit', title: '1 Minute?!', flag: 'progress_minit' },
    {
      img: 'pillar_part_clock',
      title: 'Dedicated to 5 Minutes',
      flag: 'progress_clock',
    },
    { img: 'pillar_part_nogold', title: 'No Gold', flag: 'progress_nogold' },
    {
      img: 'pillar_part_pacifist',
      title: 'Pacifist',
      flag: 'progress_pacifist',
    },

    // Orbs
    { img: 'pillar_part_orba', title: 'All Orbs', flag: 'progress_orb_all' },
    {
      img: 'pillar_part_orbe',
      title: 'Corrupted Orb',
      flag: 'progress_orb_evil',
    },
    { img: 'pillar_part_orbf', title: 'Orb', flag: 'progress_orb_1' },
  ];

  const pillar6: NoitaPillar[] = [
    { img: 'pillar_end_04' },

    {
      img: 'pillar_part_null',
      title: 'Nullifying Altar',
      flag: 'secret_null',
    },
    {
      img: 'pillar_part_hutb',
      title: 'Experimental Wand (Math)',
      flag: 'progress_hut_b',
    },
    {
      img: 'pillar_part_huta',
      title: 'Experimental Wand (Paint)',
      flag: 'progress_hut_a',
    },
    {
      img: 'pillar_part_secrethg',
      title: 'Hourglass Chamber',
      flag: 'secret_hourglass',
    },
    {
      img: 'pillar_part_secretbe',
      title: 'Buried Eye',
      flag: 'secret_buried_eye',
    },
    {
      img: 'pillar_part_secretme',
      title: 'Meditation Cube',
      flag: 'secret_meditation',
    },
    {
      img: 'pillar_part_secretae',
      title: 'All Essence Win',
      flag: 'secret_allessences',
    },
    { img: 'pillar_part_secretf', title: 'Secret Fruit', flag: 'secret_fruit' },
    {
      img: 'pillar_part_secretten',
      title: 'Avarice',
      flag: 'card_unlocked_divide',
    },
    {
      img: 'pillar_part_secretall',
      title: 'The End of Everything',
      flag: 'card_unlocked_everything',
    },
    {
      img: 'pillar_part_secretcl',
      title: 'Coral Chest',
      flag: 'secret_chest_light',
    },
    {
      img: 'pillar_part_secretcd',
      title: 'Dark Chest',
      flag: 'secret_chest_dark',
    },
    {
      img: 'pillar_part_yeah2',
      title: 'FRIENDSHIP',
      flag: 'final_secret_orb2',
    },
    { img: 'pillar_part_yeah', title: 'Friendship', flag: 'final_secret_orb' },
    {
      img: 'pillar_part_secretg',
      title: 'Eternal Wealth',
      flag: 'secret_greed',
    },
  ];

  const pillarBottom: NoitaPillar[] = [
    { img: 'pillar_part' },
    { img: 'pillar_part_fade' },
  ];

  return [pillar1, pillar2, pillar3, pillar4, pillar5, pillar6].map((pillar) =>
    [...pillar, ...pillarBottom].reverse(),
  );
};
