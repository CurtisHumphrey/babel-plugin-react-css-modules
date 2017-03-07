// @flow

import BabelTypes, {
  ObjectExpression
} from 'babel-types';

type InputObjectType = {
  [key: string]: string | InputObjectType
};

/**
 * Creates an AST representation of an InputObjectType shape object.
 */
const createObjectExpression = (bt: BabelTypes, object: InputObjectType): ObjectExpression => {
  const properties = [];

  for (const name of Object.keys(object)) {
    const value = object[name];

    let newValue;

    // eslint-disable-next-line no-empty
    if (bt.isAnyTypeAnnotation(value)) {

    } else if (typeof value === 'string') {
      newValue = bt.stringLiteral(value);
    } else if (typeof value === 'object') {
      newValue = createObjectExpression(bt, value);
    } else {
      throw new Error('Unexpected type.');
    }

    properties.push(
      bt.objectProperty(
        bt.identifier('\'' + name + '\''),
        newValue
      )
    );
  }

  return bt.objectExpression(properties);
};

export default createObjectExpression;
