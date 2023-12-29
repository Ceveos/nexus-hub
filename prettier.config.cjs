/** @type {import("prettier").Config} */
const config = {
  bracketSpacing: true,
  semi: true,
  trailingComma: "all",
  printWidth: 80,
  tabWidth: 2,
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
};

module.exports = config;
