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
}

// https://www.npmjs.com/package/idb
const setupNoitaExplorerDb = async () => {
  const dbName = 'noita-explorer-db';
  const version = 1;

  const db = await openDB<NoitaExplorerDBSchema>(dbName, version, {
    upgrade(db, oldVersion, newVersion) {
      db.createObjectStore('config');
      db.createObjectStore('file-access');

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
  };
};

export const noitaDb = setupNoitaExplorerDb();
