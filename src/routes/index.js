const DEFAULT_PROTOCOL = 'http';
const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 8080;
const DEFAULT_STORAGE_ALIAS = 'dev';
const DEFAULT_BASIS_TIME = '-'; // Datomic current-time basis

const resources = {
  storageAliases: () => `/data/`,
  databases: ({ storageAlias }) => `/data/${storageAlias}/`,
  database: ({ storageAlias, database }) => `${resources.databases({ storageAlias })}${database}/`,
  databaseData: ({ storageAlias, database, basisTime = DEFAULT_BASIS_TIME }) => `${resources.database({ storageAlias, database })}${basisTime}/`,
  datoms: ({ storageAlias, database, basisTime }) => `${resources.databaseData({ storageAlias, database, basisTime })}datoms`,
  events: ({ storageAlias, database }) => `/events/${storageAlias}/${database}`,
};

export default ({ protocol = DEFAULT_PROTOCOL, host = DEFAULT_HOST, port = DEFAULT_PORT, storageAlias = DEFAULT_STORAGE_ALIAS, database }) => {
  const rootUri = `${protocol}://${host}:${port}`;

  return {
    listStorageAliases: () => rootUri + resources.storageAliases(),
    listDatabases: () => rootUri + resources.databases({ storageAlias }),
    createDatabase: () => rootUri + resources.databases({ storageAlias }),
    transact: () => rootUri + resources.database({ storageAlias, database }),
    getDatabaseInfo: ({ basisTime = DEFAULT_BASIS_TIME }) => rootUri + resources.databaseData({ storageAlias, database, basisTime }),
    getDatoms: ({ basisTime = DEFAULT_BASIS_TIME }) => `${rootUri}${resources.databaseData({ storageAlias, database, basisTime })}datoms`,
    getEntity: ({ basisTime = DEFAULT_BASIS_TIME }) => `${rootUri}${resources.databaseData({ storageAlias, database, basisTime })}entity`,
    query: () => `${rootUri}/api/query`,
    subscribeToEvents: () => rootUri + resources.events({ storageAlias, database }),
  };
};
