/* global define describe, it */
import Datomic from '../';

describe('Datomic', () => {
  const storageAlias = 'dev';
  const databaseName = `db${Date.now()}`;
  let db;

  it('should instantiate, creating a new database if necessary', () => {
    db = new Datomic({ storageAlias, database: databaseName });

    return Datomic
      .listDatabases()
      .then(databases => databases.should.include(databaseName));
  });

  it('should list storage aliases', () => {
    return Datomic
      .listStorageAliases()
      .then(storageAliases => storageAliases.should.include(storageAlias));
  });

  it('should create a database', () => {
    const newDatabaseName = `${databaseName}2`;

    return Datomic
      .createDatabase({ storageAlias, database: newDatabaseName })
      .then(() => Datomic.listDatabases())
      .then(databases => databases.should.include(newDatabaseName));
  });

  it('should accept a transaction', () => {
    return Promise.reject(new Error('Test not yet implemented...'));
    // return db
    //   .transact(/* transaction */)
    //   .then(/* ... */);
  });

  it('should get datoms', () => {
    return Promise.reject(new Error('Test not yet implemented...'));
    // return db
    //   .getDatoms(/* options */)
    //   .then(/* ... */);
  });

  it('should get an entity', () => {
    return Promise.reject(new Error('Test not yet implemented...'));
    // return db
    //   .getEntity(/* options */)
    //   .then(/* ... */);
  });

  it('should accept a query', () => {
    return Promise.reject(new Error('Test not yet implemented...'));
    // return db
    //   .query({ query: { ... } })
    //   .then(/* ... */);
  });

  it('should accept a query with args', () => {
    return Promise.reject(new Error('Test not yet implemented...'));
    // return db
    //   .query({ query: { ... }, args: { ... } })
    //   .then(/* ... */);
  });

  it('should subscribe to events', () => {
    return Promise.reject(new Error('Test not yet implemented...'));
    // return db
    //   .subscribeToEvents()
    //   .then(/* ... */);
  });
});
