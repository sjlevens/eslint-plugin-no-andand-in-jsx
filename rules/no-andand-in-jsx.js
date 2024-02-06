module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "disallow the use of && for conditional rendering in JSX",
      category: "Best Practices",
      recommended: false,
    },
    fixable: "code",
    schema: [],
  },

  create(context) {
    return {
      JSXExpressionContainer(node) {
        // Early exit if the node's expression is not a LogicalExpression with '&&'
        if (
          node.expression.type !== "LogicalExpression" ||
          node.expression.operator !== "&&"
        )
          return;

        if (
          node.expression.right.type === "JSXElement" ||
          node.expression.right.type === "JSXFragment"
        ) {
          context.report({
            node,
            message: "Do not use && for conditional rendering in JSX.",
            fix(fixer) {
              let sourceCode = context.getSourceCode();

              // Function to recursively gather and format conditions
              function formatCondition(expr) {
                if (expr.type === "LogicalExpression") {
                  const left = formatCondition(expr.left);
                  const right = formatCondition(expr.right);
                  if (expr.operator === "&&") {
                    // If right part is an || expression, wrap it in parentheses
                    if (
                      expr.right.type === "LogicalExpression" &&
                      expr.right.operator === "||"
                    ) {
                      return `${left} && (${sourceCode.getText(expr.right)})`;
                    }
                    return `${left} && ${right}`;
                  } else if (expr.operator === "||") {
                    return `(${left} || ${right})`;
                  }
                } else {
                  return sourceCode.getText(expr);
                }
              }

              const condition = formatCondition(node.expression.left);
              const finalExpression = sourceCode.getText(node.expression.right);
              const fixText = `${condition} ? ${finalExpression} : null`;

              return fixer.replaceText(node.expression, fixText);
            },
          });
        }
      },
    };
  },
};
