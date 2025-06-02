import pillarPart from '../../assets/pillars/pillar_part.png';
import pillarPartFade from '../../assets/pillars/pillar_part_fade.png';

// 1. pillar
import pillarEnd1 from '../../assets/pillars/pillar_end_01.png';
import pillarHalo from '../../assets/pillars/pillar_part_phalo.png';
import pillarLukki from '../../assets/pillars/pillar_part_plukki.png';
import pillarFungi from '../../assets/pillars/pillar_part_pfungi.png';
import pillarRatty from '../../assets/pillars/pillar_part_prat.png';
import pillarGhostly from '../../assets/pillars/pillar_part_pghost.png';
import pillarTower from '../../assets/pillars/pillar_part_secrett.png';
import pillarDarkSunRock from '../../assets/pillars/pillar_part_dseffect.png';
import pillarSunRock from '../../assets/pillars/pillar_part_seffect.png';
import pillarMockStatue from '../../assets/pillars/pillar_part_mbots.png';
import pillarPotions from '../../assets/pillars/pillar_part_mrain.png';
import pillarTablets from '../../assets/pillars/pillar_part_train.png';
import pillarGreedCurse from '../../assets/pillars/pillar_part_grain.png';
import pillarWormCrystal from '../../assets/pillars/pillar_part_wrain.png';
import pillarUtilityBox from '../../assets/pillars/pillar_part_urain.png';
import pillarChest from '../../assets/pillars/pillar_part_crain.png';

// 2. pillar
import pillarEnd2 from '../../assets/pillars/pillar_end_03.png';
import pillarAASBD from '../../assets/pillars/pillar_part_dsunmoon.png';
import pillarAASB from '../../assets/pillars/pillar_part_sunmoon.png';
import pillarDarkGourdMoon from '../../assets/pillars/pillar_part_dmoong.png';
import pillarDarkMoon from '../../assets/pillars/pillar_part_dmoon.png';
import pillarGourdMoon from '../../assets/pillars/pillar_part_moong.png';
import pillarDrunkMoon from '../../assets/pillars/pillar_part_moona.png';
import pillarMoon from '../../assets/pillars/pillar_part_moon.png';
import pillarEssenceSpirits from '../../assets/pillars/pillar_part_essenceal.png';
import pillarEssenceAir from '../../assets/pillars/pillar_part_essencea.png';
import pillarEssenceEarth from '../../assets/pillars/pillar_part_essencee.png';
import pillarEssenceWater from '../../assets/pillars/pillar_part_essencew.png';
import pillarEssenceFire from '../../assets/pillars/pillar_part_essencef.png';

// 3. pillar
import pillarEnd3 from '../../assets/pillars/pillar_end_06.png';
import pillarNightmare from '../../assets/pillars/pillar_part_endn.png';
import pillarEndingNGPPP from '../../assets/pillars/pillar_part_endp.png';
import pillarEndingPeaceful from '../../assets/pillars/pillar_part_endg.png';
import pillarEndingPure from '../../assets/pillars/pillar_part_endb.png';
import pillarEndingToxic from '../../assets/pillars/pillar_part_endt.png';
import pillarEndingNormal from '../../assets/pillars/pillar_part_end0.png';

// 4. pillar
import pillarEnd4 from '../../assets/pillars/pillar_end_02.png';
import pillarKolmi from '../../assets/pillars/pillar_part_boss.png';
import pillarKivi from '../../assets/pillars/pillar_part_minisky.png';
import pillarToveri from '../../assets/pillars/pillar_part_yeah3.png';
import pillarGate from '../../assets/pillars/pillar_part_minigm.png';
import pillarTapios from '../../assets/pillars/pillar_part_threelk.png';
import pillarTapion from '../../assets/pillars/pillar_part_elk.png';
import pillarSyvaolento from '../../assets/pillars/pillar_part_fish.png';
import pillarLimatoukka from '../../assets/pillars/pillar_part_maggot.png';
import pillarMestarien from '../../assets/pillars/pillar_part_meme.png';
import pillarKolmiSilma from '../../assets/pillars/pillar_part_minir.png';
import pillarYlialkemisti from '../../assets/pillars/pillar_part_minia.png';
import pillarSauvojen from '../../assets/pillars/pillar_part_minip.png';
import pillarUnohdettu from '../../assets/pillars/pillar_part_minigh.png';
import pillarKolmiSydan from '../../assets/pillars/pillar_part_meat.png';
import pillarKolmiKoipi from '../../assets/pillars/pillar_part_minil.png';
import pillarSuomuhauki from '../../assets/pillars/pillar_part_minid.png';

interface NoitaPillar {
  img: string;
  title?: string;
  unlocked?: boolean;
}

export const noitaProgressTrackerPillarDefinitions = (): NoitaPillar[][] => {
  const pillar1: NoitaPillar[] = [
    { img: pillarEnd1 },

    // Transformations
    { img: pillarHalo, title: 'Halo Transformation' },
    { img: pillarLukki, title: 'Lukki Transformation' },
    { img: pillarFungi, title: 'Funky Transformation' },
    { img: pillarRatty, title: 'Ratty Transformation' },
    { img: pillarGhostly, title: 'Ghostly Transformation' },

    // Tower
    { img: pillarTower, title: 'Tower' },

    // Sacrifice
    { img: pillarDarkSunRock, title: 'Sacrifice Dark Sun Rock' },
    { img: pillarSunRock, title: 'Sacrifice Sun Rock' },
    { img: pillarMockStatue, title: 'Sacrifice Monk Statue' },
    { img: pillarPotions, title: 'Sacrifice Henkevä potu' },
    { img: pillarTablets, title: 'Sacrifice Tablets' },
    { img: pillarGreedCurse, title: 'Sacrifice Greed Curse' },
    { img: pillarWormCrystal, title: 'Sacrifice Worm Crystal' },
    { img: pillarUtilityBox, title: 'Sacrifice Utility Box' },
    { img: pillarChest, title: 'Sacrifice Chest' },

    { img: pillarPart },
    { img: pillarPartFade },
  ];

  const pillar2: NoitaPillar[] = [
    { img: pillarEnd2 },

    // As Above, So Below
    { img: pillarAASBD, title: 'As Above, So Below (Dark)' },
    { img: pillarAASB, title: 'As Above, So Below' },

    // Dark Moon
    { img: pillarDarkGourdMoon, title: 'Dark Gourd Moon' },
    { img: pillarDarkMoon, title: 'Blood Moon' },

    // Moon
    { img: pillarGourdMoon, title: 'Gourd Moon' },
    { img: pillarDrunkMoon, title: 'Drunk Moon' },
    { img: pillarMoon, title: 'Moon' },

    // Essences
    { img: pillarEssenceSpirits, title: 'Essence of Spirits' },
    { img: pillarEssenceAir, title: 'Essence of Air' },
    { img: pillarEssenceEarth, title: 'Essence of Earth' },
    { img: pillarEssenceWater, title: 'Essence of Water' },
    { img: pillarEssenceFire, title: 'Essence of Fire' },

    { img: pillarPart },
    { img: pillarPartFade },
  ];

  const pillar3: NoitaPillar[] = [
    { img: pillarEnd3 },

    { img: pillarNightmare, title: 'Nightmare' },
    { img: pillarEndingNGPPP, title: 'New Game+++' },
    { img: pillarEndingPeaceful, title: 'Peaceful Ending' },
    { img: pillarEndingPure, title: 'Mountain Ending (Pure)' },
    { img: pillarEndingToxic, title: 'Mountain Ending (Toxic)' },
    { img: pillarEndingNormal, title: 'Normal Ending' },

    { img: pillarPart },
    { img: pillarPartFade },
  ];

  const pillar4: NoitaPillar[] = [
    { img: pillarEnd4 },

    { img: pillarKolmi, title: 'Kolmisilmä' },
    { img: pillarKivi, title: 'Kivi' },
    { img: pillarToveri, title: 'Toveri' },
    { img: pillarGate, title: 'Gate Guardian' },
    { img: pillarTapios, title: "Tapio's Wrath" },
    { img: pillarTapion, title: 'Tapion Vasalli' },
    { img: pillarSyvaolento, title: 'Syväolento' },
    { img: pillarLimatoukka, title: 'Limatoukka' },
    { img: pillarMestarien, title: 'Mestarien mestari' },
    { img: pillarKolmiSilma, title: 'Kolmisilmän silmä' },
    { img: pillarYlialkemisti, title: 'Ylialkemisti' },
    { img: pillarSauvojen, title: 'Sauvojen tuntija' },
    { img: pillarUnohdettu, title: 'Unohdettu' },
    { img: pillarKolmiSydan, title: 'Kolmisilmän sydän' },
    { img: pillarKolmiKoipi, title: 'Kolmisilmän koipi' },
    { img: pillarSuomuhauki, title: 'Suomuhauki' },

    { img: pillarPart },
    { img: pillarPartFade },
  ];

  const pillars = [pillar1, pillar2, pillar3, pillar4];
  pillars.forEach((p) => p.reverse());
  return pillars;
};
