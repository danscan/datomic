const DEFAULT_PROTOCOL = 'http';
const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 8080;
const DEFAULT_STORAGE_ALIAS = 'dev';

const resources = {
  storageAliases: () => `/data/`,
  databases: ({ storageAlias }) => `/data/${storageAlias}/`,
  database: ({ storageAlias, database }) => `${resources.databases({ storageAlias })}${database}/`,
  databaseData: ({ storageAlias, database, basisT = '-' }) => `${resources.database({ storageAlias, database })}/${basisT}/`,
  datoms: ({ storageAlias, database, basisT }) => `${resources.databaseData({ storageAlias, database, basisT })}datoms`,
  events: ({ storageAlias, database }) => `/events/${storageAlias}/${database}`,
};

export default ({ protocol = DEFAULT_PROTOCOL, host = DEFAULT_HOST, port = DEFAULT_PORT, storageAlias = DEFAULT_STORAGE_ALIAS, database }) => {
  const rootUri = `${protocol}://${host}:${port}`;

  return {
    listStorageAliases: () => rootUri + resources.storageAliases(),
    listDatabases: () => rootUri + resources.databases({ storageAlias }),
    createDatabase: () => rootUri + resources.databases({ storageAlias }),
    transact: () => rootUri + resources.database({ storageAlias, database }),
    getDatabaseInfo: ({ basisT = '-' }) => rootUri + resources.databaseData({ storageAlias, database, basisT }),
    getDatoms: ({ basisT = '-' }) => `${rootUri}${resources.databaseData({ storageAlias, database, basisT })}datoms`,
    getEntity: ({ basisT = '-' }) => `${rootUri}${resources.databaseData({ storageAlias, database, basisT })}entity`,
    query: () => `${rootUri}/api/query`,
    subscribeToEvents: () => rootUri + resources.events({ storageAlias, database }),
  };
};
