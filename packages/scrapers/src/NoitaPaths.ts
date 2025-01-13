export const noitaPaths = {
  noitaDataWak: {
    folder: ['data'],
    icons: {
      inventory: ['data', 'ui_gfx', 'inventory'],
      animals: ['data', 'ui_gfx', 'animal_icons'],
      spells: ['data', 'ui_gfx', 'gun_actions'],
      perks: ['data', 'ui_gfx', 'perk_icons'],
    },
    luaScripts: {
      guns: ['data', 'scripts', 'gun', 'gun_actions.lua'],
      wands: ['data', 'scripts', 'gun', 'procedural', 'wands.lua'],
      perks: ['data', 'scripts', 'perks', 'perk_list.lua'],
    },
    xmlData: {
      animals: ['data', 'entities', 'animals'],
      entities: ['data', 'entities'],
    },
  },
  noitaInstallFolder: {
    translation: ['data', 'translations', 'common.csv'],
    translationDev: ['data', 'translations', 'common_dev.csv'],
    dataWak: ['data', 'data.wak'],
  },
  save00: {
    folder: ['save00'],
    stats: ['stats'],
    sessions: ['stats', 'sessions'],
    flags: ['persistent', 'flags'],
    bones_new: ['persistent', 'bones_new'],
  },
};
