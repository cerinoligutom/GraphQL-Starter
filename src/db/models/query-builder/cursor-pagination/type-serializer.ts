// tslint:disable:no-any max-classes-per-file
class TypeSerializer {
  typeName: string;
  constructor(typeName: string) {
    this.typeName = typeName;
  }

  getPrefix() {
    return `(${this.typeName})`;
  }
}

class DateSerializer extends TypeSerializer {
  constructor() {
    super('date');
  }

  test(value: any) {
    return value instanceof Date;
  }

  serialize(value: Date) {
    return value.toISOString();
  }

  deserialize(value: string) {
    return new Date(value);
  }
}

class JSONSerializer extends TypeSerializer {
  constructor() {
    super('json');
  }

  test() {
    // Any type can be stringified
    return true;
  }

  serialize(value: any) {
    return JSON.stringify(value);
  }

  deserialize(value: any) {
    return JSON.parse(value);
  }
}

const serializers = [new DateSerializer(), new JSONSerializer()];

function serializeValue(value: any) {
  const serializer = serializers.find(s => s.test(value))!;
  return `${serializer.getPrefix()}${serializer.serialize(value)}`;
}

function deserializeString(str: string) {
  const matches = str.match(/\((.*?)\)(.*)/);

  if (!matches) {
    throw new TypeError('Invalid cursor');
  }

  const typeName = matches[1];
  const serializedValue = matches[2];
  const serializer = serializers.find(s => s.typeName === typeName)!;
  return serializer.deserialize(serializedValue);
}

export { serializeValue, deserializeString };
