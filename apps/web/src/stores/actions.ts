import { create } from 'zustand';
import {
  BonesDeleteFileAction,
  NoitaAction,
  NoitaEnemy,
  NoitaPerk,
  NoitaSpell,
  PlayerDecorationUnlock,
  UnlockDecorationAction,
  UnlockEnemyAction,
  UnlockPerkAction,
  UnlockSpellAction,
} from '@noita-explorer/model-noita';

interface ActionsState {
  actionUtils: {
    deleteBonesWand: {
      isOnList: (fileName: string) => boolean;
      get: (fileName: string) => BonesDeleteFileAction | undefined;
      create: (fileName: string) => BonesDeleteFileAction;
    };
    perksUnlock: {
      isOnList: (perkId: string) => boolean;
      get: (perkId: string) => UnlockPerkAction | undefined;
      create: (perk: NoitaPerk) => UnlockPerkAction;
    };
    spellUnlock: {
      isOnList: (spellId: string) => boolean;
      get: (spellId: string) => UnlockSpellAction | undefined;
      create: (spell: NoitaSpell) => UnlockSpellAction;
    };
    enemyUnlock: {
      isOnList: (enemyId: string) => boolean;
      get: (enemyId: string) => UnlockEnemyAction | undefined;
      create: (enemy: NoitaEnemy) => UnlockEnemyAction;
    };
    playerDecoration: {
      isOnList: (decoration: PlayerDecorationUnlock) => boolean;
      get: (
        decoration: PlayerDecorationUnlock,
      ) => UnlockDecorationAction | undefined;
      create: (
        decoration: PlayerDecorationUnlock,
        permanent: boolean,
      ) => UnlockDecorationAction;
    };
    removeAction: (action: NoitaAction) => void;
  };

  actions: Record<string, NoitaAction>;
}

export const useNoitaActionsStore = create<ActionsState>(
  (set, get): ActionsState => {
    const isOnList = (actionId: string) => actionId in get().actions;

    const idFactory = {
      deleteBonesWand: (fileName: string) => 'bones-' + fileName,
      perksUnlock: (perkId: string) => 'perk-unlock-' + perkId,
      spellUnlock: (spellId: string) => 'action-unlock-' + spellId,
      enemyUnlock: (enemyId: string) => 'enemy-unlock-' + enemyId,
      playerDecoration: (decoration: PlayerDecorationUnlock) =>
        'player-decoration-' + decoration,
    };

    const addAction = (action: NoitaAction) => {
      set((prev) => {
        if (action.id in prev.actions) {
          return prev;
        }

        const actions = { ...prev.actions };
        actions[action.id] = action;

        return { ...prev, actions };
      });
    };

    const getAction = (actionId: string): NoitaAction | undefined =>
      get().actions[actionId];

    return {
      actions: {},
      actionUtils: {
        deleteBonesWand: {
          isOnList: (fileName) => {
            const id = idFactory.deleteBonesWand(fileName);
            return isOnList(id);
          },
          get: (fileName) => {
            const id = idFactory.deleteBonesWand(fileName);
            const action = getAction(id);

            if (action?.type !== 'bones-wand-delete') {
              return;
            }

            return action;
          },
          create: (fileName) => {
            const newAction: BonesDeleteFileAction = {
              type: 'bones-wand-delete',
              id: idFactory.deleteBonesWand(fileName),
              name: 'Delete Bones file: ' + fileName,
              payload: {
                bonesFileName: fileName,
              },
            };

            addAction(newAction);

            return newAction;
          },
        },
        perksUnlock: {
          isOnList: (perkId) => {
            const id = idFactory.perksUnlock(perkId);
            return isOnList(id);
          },
          get: (perkId) => {
            const id = idFactory.perksUnlock(perkId);
            const action = getAction(id);

            if (action?.type !== 'unlock-perk') {
              return;
            }

            return action;
          },
          create: (perk) => {
            const newAction: UnlockPerkAction = {
              type: 'unlock-perk',
              id: idFactory.perksUnlock(perk.id),
              name: 'Unlock perk ' + perk.name,
              payload: { perkId: perk.id },
            };

            addAction(newAction);

            return newAction;
          },
        },
        spellUnlock: {
          isOnList: (spellId) => {
            const id = idFactory.spellUnlock(spellId);
            return isOnList(id);
          },
          get: (spellId) => {
            const id = idFactory.spellUnlock(spellId);
            const action = getAction(id);

            if (action?.type !== 'unlock-spell') {
              return;
            }

            return action;
          },
          create: (spell) => {
            const newAction: UnlockSpellAction = {
              type: 'unlock-spell',
              id: idFactory.spellUnlock(spell.id),
              name: 'Unlock spell ' + spell.name,
              payload: { spellId: spell.id },
            };

            addAction(newAction);

            return newAction;
          },
        },
        enemyUnlock: {
          isOnList: (enemyId) => {
            const id = idFactory.enemyUnlock(enemyId);
            return isOnList(id);
          },
          get: (enemyId) => {
            const id = idFactory.enemyUnlock(enemyId);
            const action = getAction(id);

            if (action?.type !== 'unlock-enemy') {
              return;
            }

            return action;
          },
          create: (enemy) => {
            const newAction: UnlockEnemyAction = {
              type: 'unlock-enemy',
              id: idFactory.enemyUnlock(enemy.id),
              name: `Unlock enemy ${enemy.name} (${enemy.id})`,
              payload: {
                enemyId: enemy.id,
                numberOfTimesEnemyKilled: 1,
              },
            };

            addAction(newAction);

            return newAction;
          },
        },
        playerDecoration: {
          isOnList: (decoration) => {
            const id = idFactory.playerDecoration(decoration);
            return isOnList(id);
          },
          get: (decoration) => {
            const id = idFactory.playerDecoration(decoration);
            const action = getAction(id);

            if (action?.type !== 'unlock-decoration') {
              return;
            }

            return action;
          },
          create: (decoration, permanent) => {
            const newAction: UnlockDecorationAction = {
              type: 'unlock-decoration',
              id: idFactory.playerDecoration(decoration),
              name:
                'Unlock decoration ' +
                (decoration === 'secret_amulet' ? 'Golden Necklace' : '') +
                (decoration === 'secret_amulet_gem' ? 'Amulet Gem' : '') +
                (decoration === 'secret_hat' ? 'Crown' : '') +
                ' ' +
                (permanent ? 'permanently' : ' for this run'),
              payload: {
                decoration: decoration,
                permanent: permanent,
              },
            };

            addAction(newAction);

            return newAction;
          },
        },
        removeAction: (action) => {
          set((prev) => {
            const newActions = { ...prev.actions };
            delete newActions[action.id];

            return { ...prev, actions: newActions };
          });
        },
      },
    };
  },
);
