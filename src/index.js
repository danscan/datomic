import routes from './routes';
import request from 'superagent';
import edn from 'jsedn';

// Configuration constants
const EDN_MIME_TYPE = 'application/edn';

export default class Datomic {
  constructor({ host, port, storageAlias, database, protocol }) {
    this.routes = routes({ host, port, storageAlias, database, protocol });

    Datomic.listDatabases({ host, port, storageAlias, protocol })
      .then(databases => {
        const databaseExists = databases.indexOf(database) >= 0;

        if (!databaseExists) {
          console.log(`Database '${database}' does not exist...`);
          return Datomic.createDatabase({ host, port, storageAlias, database, protocol });
        }

        console.log(`Database '${database} exists...`);
      });
  }

  static createDatabase({ host, port, storageAlias, database, protocol }) {
    const { createDatabase: getRoute } = routes({ host, port, storageAlias, database, protocol });

    return requestEdn({
      uri: getRoute(),
      method: 'post',
      body: new edn.Map([edn.kw(':db-name'), database]),
    });
  }

  static listStorageAliases({ host, port, protocol } = {}) {
    const { listStorageAliases: getRoute } = routes({ host, port, protocol });

    return requestEdn({
      uri: getRoute(),
      method: 'get',
    });
  }

  static listDatabases({ host, port, storageAlias, protocol } = {}) {
    const { listDatabases: getRoute } = routes({ host, port, storageAlias, protocol });

    return requestEdn({
      uri: getRoute(),
      method: 'get',
    });
  }

  transact(transaction) {
    return requestEdn({
      uri: this.routes.transact(),
      method: 'post',
      body: new edn.Map([edn.kw(':tx-data'), transaction]),
    });
  }

  getDatabaseInfo({ basisT }) {
    return requestEdn({
      uri: this.routes.getDatabaseInfo({ basisT }),
      method: 'get',
    });
  }

  getDatoms({ basisT, index, entity, attribute, value, startValue, endValue, limit, offset, asOfT, sinceT, historical }) {
    const options = {
      index,
      'e': entity,
      'a': attribute,
      'v': value,
      'start': startValue,
      'end': endValue,
      limit,
      offset,
      'as-of-t': asOfT,
      'since-t': sinceT,
      'history': historical,
    };

    return requestEdn({
      uri: this.routes.getDatoms({ basisT }),
      method: 'get',
      query: options,
    });
  }

  getEntity({ basisT, entity, asOfT, sinceT }) {
    const options = {
      'e': entity,
      'as-of-t': asOfT,
      'since-t': sinceT,
    };

    return requestEdn({
      uri: this.routes.getEntity({ basisT }),
      method: 'get',
      query: options,
    });
  }

  query({ query, args }) {
    // TODO: Validate query..?
    console.log('TODO: Validate query..?');

    return requestEdn({
      uri: this.routes.query(),
      method: 'post',
      body: new edn.Map([edn.kw(':q'), query, edn.kw(':args'), args]),
    });
  }

  // TODO: Implement subscribeToEvents...
  subscribeToEvents(/* { basisT } */) {
    return Promise.reject(new Error('Not yet implemented...'));

    // return requestEdn({
    //   uri: this.routes.subscribeToEvents({ basisT }),
    //   method: 'get',
    // });
  }
}

// Private helpers
function requestEdn({ uri, method, query, body }) {
  // Determine request method name from method param
  let methodName = method.toLowerCase();
  methodName = methodName === 'delete'
              ? 'del'
              : methodName;

  // Encode body into edn
  const ednBody = !!body
                ? edn.encode(body)
                : undefined;

  console.log('requestEdn...');
  console.log('methodName:', methodName);
  console.log('uri:', uri);
  console.log('query:', query);
  console.log('body:', body);
  console.log('ednBody:', ednBody);

  return new Promise((resolve, reject) => {
    request[methodName](uri)
      .type(EDN_MIME_TYPE)
      .accept(EDN_MIME_TYPE)
      .buffer(true)
      .query(query)
      .send(ednBody)
      .end((error, res) => {
        if (error) {
          console.error('requestEdn error:', error);
          return reject(error);
        }

        const ednResponseBody = res.text;
        console.log('requestEdn... ednResponseBody:', ednResponseBody);

        const jsonResponseBody = edn.parse(ednResponseBody);
        console.log('requestEdn... jsonResponseBody:', jsonResponseBody);

        return resolve(jsonResponseBody.val);
      });
  });
}
