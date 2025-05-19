import { openDB, DBSchema } from 'idb';

interface NoitaExplorerDBSchema extends DBSchema {
  'file-access': {
    key: string;
    value: FileSystemFileHandle | FileSystemDirectoryHandle;
  };
  config: {
    key: string;
    value: string;
  };
  'app-config': {
    key: string;
    value: string | number;
  };
}

// https://www.npmjs.com/package/idb
const setupNoitaExplorerDb = async () => {
  const dbName = 'noita-explorer-db';
  const version = 2;

  const db = await openDB<NoitaExplorerDBSchema>(dbName, version, {
    upgrade(db, oldVersion, newVersion) {
      if (oldVersion < 1) {
        db.createObjectStore('config');
        db.createObjectStore('file-access');
      }
      if (oldVersion < 2) {
        db.createObjectStore('app-config');
      }

      console.info(`DB Version upgraded from ${oldVersion} to ${newVersion}`);
    },
    blocked(currentVersion, blockedVersion, event) {
      console.error(
        `DB Error: older versions (${blockedVersion}) of the database are open on the origin, so this version (${currentVersion}) cannot open.`,
        event,
      );
    },
    blocking(currentVersion, blockedVersion, event) {
      console.error(
        `DB Error: this connection (${blockedVersion}) is blocking a future version (${currentVersion}) of the database from opening.`,
        event,
      );
    },
    terminated() {
      console.error(
        'DB Error: the browser abnormally terminated the connection ',
      );
    },
  });

  return {
    config: {
      get: (key: string) => db.get('config', key),
      set: (key: string, value: string) => db.put('config', value, key),
    },
    fileAccess: {
      get: (key: string) => db.get('file-access', key),
      set: (
        key: string,
        value: FileSystemFileHandle | FileSystemDirectoryHandle,
      ) => db.put('file-access', value, key),
    },
    appData: {
      get: (key: string) => db.get('app-config', key),
      set: (key: string, value: string | number) =>
        db.put('app-config', value, key),
      keys: { numberOfActionsRan: 'number-of-actions-ran' },
    },
  };
};

export const noitaDb = setupNoitaExplorerDb();
