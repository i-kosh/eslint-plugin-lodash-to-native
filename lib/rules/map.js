"use strict";

/** @type {import("eslint").Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion",
    fixable: "code",
    schema: [],
    docs: {
      description:
        "Предлагает заменить метод `_.map` на нативный метод `Array.map` где это возможно",
    },
  },
  create(ctx) {
    let isLodashOverwritten = false;

    const isNewExpressionArray = (node) => {
      if (node.type === "NewExpression") {
        if (node.callee.name === "Array") return true;

        return false;
      }

      return false;
    };

    const isArgumentArray = (node) => {
      if (node.type === "ArrayExpression") return true;

      if (isNewExpressionArray(node)) return true;

      if (node.type === "Identifier") {
        const scope = ctx.getScope();

        const variable = scope.variables.find((val) => (val.name = node.name));
        if (!variable) return false;

        const varDef = variable.defs.find((val) => val.name.name === node.name);
        if (!varDef) return false;

        if (varDef.node.init.type === "ArrayExpression") return true;

        if (isNewExpressionArray(varDef.node.init)) return true;
      }

      return false;
    };

    const isFirstArgumentArray = (node) => {
      const firstArgument = node.arguments[0];
      if (!firstArgument) return false;

      return isArgumentArray(firstArgument);
    };

    const isLodashMapFunc = (node) => {
      if (isLodashOverwritten) return false;

      return (
        node.callee.object &&
        node.callee.object.name === "_" &&
        node.callee.property &&
        node.callee.property.name === "map"
      );
    };

    return {
      AssignmentExpression(node) {
        if (node.left.name === "_") {
          isLodashOverwritten = true;
        }
      },

      CallExpression(node) {
        if (isLodashMapFunc(node) && isFirstArgumentArray(node)) {
          ctx.report({
            message: "Сдесь можно использовать нативный `Array.map`",
            node,
            fix: (fixer) => {
              const code = ctx.getSourceCode();

              const arr = code.getText(node.arguments[0]);
              const func = code.getText(node.arguments[1]);

              return fixer.replaceText(node, `${arr}.map(${func})`);
            },
          });
        }
      },
    };
  },
};
