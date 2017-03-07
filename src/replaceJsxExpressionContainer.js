// @flow

import BabelTypes, {
  binaryExpression,
  Identifier,
  isJSXExpressionContainer,
  isStringLiteral,
  jSXAttribute,
  JSXAttribute,
  jSXExpressionContainer,
  jSXIdentifier,
  stringLiteral
} from 'babel-types';

export default (
  bt: BabelTypes,
  path: Object,
  styleNameAttribute: JSXAttribute,
  importedHelperIndentifier: Identifier,
  styleModuleImportMapIdentifier: Identifier
): void => {
  const expressionContainerValue = styleNameAttribute.value;
  const classNameAttribute = path.node.openingElement.attributes
    .find((attribute) => {
      return typeof attribute.name !== 'undefined' && attribute.name.name === 'className';
    });

  if (classNameAttribute) {
    path.node.openingElement.attributes.splice(path.node.openingElement.attributes.indexOf(classNameAttribute), 1);
  }

  path.node.openingElement.attributes.splice(path.node.openingElement.attributes.indexOf(styleNameAttribute), 1);

  const styleNameExpression = bt.callExpression(
    importedHelperIndentifier,
    [
      expressionContainerValue.expression,
      styleModuleImportMapIdentifier
    ]
  );

  if (classNameAttribute) {
    if (isStringLiteral(classNameAttribute.value)) {
      path.node.openingElement.attributes.push(jSXAttribute(
        jSXIdentifier('className'),
        jSXExpressionContainer(
          binaryExpression(
            '+',
            bt.stringLiteral(classNameAttribute.value.value + ' '),
            styleNameExpression
          )
        )
      ));
    } else if (isJSXExpressionContainer(classNameAttribute.value)) {
      path.node.openingElement.attributes.push(jSXAttribute(
        jSXIdentifier('className'),
        jSXExpressionContainer(
          binaryExpression(
            '+',
            classNameAttribute.value.expression,
            binaryExpression(
              '+',
              stringLiteral(' '),
              styleNameExpression
            )
          )
        )
      ));
    } else {
      throw new Error('Unexpected attribute value.');
    }
  } else {
    path.node.openingElement.attributes.push(jSXAttribute(
      jSXIdentifier('className'),
      jSXExpressionContainer(
        styleNameExpression
      )
    ));
  }
};
