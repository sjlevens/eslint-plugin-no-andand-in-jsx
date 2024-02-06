const { RuleTester } = require("eslint");
const rule = require("../rules/no-andand-in-jsx");
const parserOptions = {
  ecmaVersion: 2020,
  sourceType: "module",
  ecmaFeatures: {
    jsx: true,
  },
};

const ruleTester = new RuleTester({ parserOptions });

ruleTester.run("no-andand-in-jsx", rule, {
  valid: [
    // Ternary operator in JSX
    {
      code: "<div>{condition ? <Child /> : null}</div>",
    },
    // && operator outside of JSX
    {
      code: "const result = condition && anotherFunction();",
    },

    // Using && for non-conditional logic inside a function component
    {
      code: `
      function Component() { 
        const result = condition && anotherFunction(); 
        return <div>{result}</div>; 
      }`,
    },
    // Logical AND in expressions not returning JSX
    {
      code: "const isEnabled = featureFlag && user.isAdmin;",
    },
    // Logic inside jsx not for rendering
    {
      code: `
        <Component prop={loading && isVisible}>
          test
        </Component>
      `,
    },
    // This code technically returns JSX but due to limits on the static analysis we are going to be permissive here
    {
      code: `
      function Component() {
        const getContent = () => <div>jsx</div>;

        return <div>{condition && getContent()}</div>;
      }`,
    },
  ],
  invalid: [
    {
      code: "<div>{condition && <Child />}</div>",
      errors: [{ message: "Do not use && for conditional rendering in JSX." }],
      output: "<div>{condition ? <Child /> : null}</div>",
    },
    // Inline condition without a wrapper component
    {
      code: "<>{condition && <Child />}</>",
      errors: [{ message: "Do not use && for conditional rendering in JSX." }],
      output: "<>{condition ? <Child /> : null}</>",
    },

    // Nested conditional rendering
    {
      code: "<div>{condition && <Child>{condition2 && <NestedChild />}</Child>}</div>",
      errors: [
        { message: "Do not use && for conditional rendering in JSX." },
        { message: "Do not use && for conditional rendering in JSX." },
      ],
      output:
        "<div>{condition ? <Child>{condition2 && <NestedChild />}</Child> : null}</div>",
    },
    // Multiple && operators
    {
      code: "<div>{condition && condition2 && <Child />}</div>",
      errors: [{ message: "Do not use && for conditional rendering in JSX." }],
      output: "<div>{condition && condition2 ? <Child /> : null}</div>",
    },
    {
      code: "<div>{condition && condition2 && (condition3 || condition4) && <Child />}</div>",
      errors: [{ message: "Do not use && for conditional rendering in JSX." }],
      output:
        "<div>{condition && condition2 && (condition3 || condition4) ? <Child /> : null}</div>",
    },
    {
      code: "<div>{condition && (condition2 || condition3 || condition4) && condition5 && <Child />}</div>",
      errors: [
        {
          message: "Do not use && for conditional rendering in JSX.",
        },
      ],
      output:
        "<div>{condition && (condition2 || condition3 || condition4) && condition5 ? <Child /> : null}</div>",
    },
  ],
});
