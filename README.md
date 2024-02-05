# eslint-plugin-no-andand-in-jsx

Prevent the use of `&&` for conditional rendering in JSX to encourage more explicit conditional rendering methods, such as ternary operators. This ESLint plugin provides a rule to enforce this practice, helping to avoid bugs and improve code readability.

## Rationale

While using `&&` in JSX for conditional rendering is a common pattern, it can sometimes lead to unexpected results, especially with falsy values that are not null or undefined. This rule encourages the use of ternary operators, which require explicit handling of both truthy and falsy paths, making the code's intention clearer and reducing potential bugs.

## Installation

First, install [ESLint](http://eslint.org) if it is not already installed:

```bash
npm install eslint --save-dev

yarn add eslint -D
```

Next, install eslint-plugin-no-andand-in-jsx:

```bash
npm install eslint-plugin-no-andand-in-jsx --save-dev

yarn add eslint-plugin-no-andand-in-jsx -D
```

## Usage

Add no-andand-in-jsx to the plugins section of your .eslintrc configuration file. You can omit the eslint-plugin- prefix. Then configure the rules you want to use under the rules section.

```json
{
  "plugins": ["no-andand-in-jsx"],
  "rules": {
    "no-andand-in-jsx/no-andand-in-jsx": "error"
  }
}
```

## Rule Details

This rule looks for any usage of && in JSX expressions and reports an error, suggesting the use of a ternary operator instead.

### Examples of incorrect code for this rule:

```jsx
<div>{condition && <Child />}</div>
```

Examples of correct code for this rule:

```jsx
<div>{condition ? <Child /> : null}</div>
```

### Suggested Fix

The rule provides a fix that automatically transforms expressions using && for conditional rendering into ternary expressions, ensuring an explicit null return for the falsy condition.

**This fix is directly manipulating code that involves logic. Double check the fix is maintaining the logic as expected**
