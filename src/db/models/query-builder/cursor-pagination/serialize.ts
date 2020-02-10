// tslint:disable:no-any

import base64url from 'base64url';
import _ from 'lodash';
import { serializeValue, deserializeString } from './type-serializer';
import { IOrderByOperation } from './IOrderByOperation';
import { Maybe } from 'graphql-resolvers';

function serializeCursor(ops: IOrderByOperation[], item: any) {
  if (!item) {
    return '';
  }

  return ops
    .map(({ property }) => {
      const val = _.get(item, property!, null);
      return base64url(serializeValue(val));
    })
    .join('.');
}

function deserializeCursor(ops: IOrderByOperation[], cursor: Maybe<string> = '') {
  if (!cursor) {
    return null;
  }

  const values = cursor.split('.').map(b64 => (b64 ? deserializeString(base64url.decode(b64)) : b64));

  return ops.reduce((acc, { property }, i) => {
    _.set(acc, property!, values[i]);
    return acc;
  }, {});
}

export { serializeCursor, deserializeCursor };
