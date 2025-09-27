// eslint.config.mjs

export default [
  {
    ignores: [
      "node_modules",
      ".next/",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // Change from "error" → "warn"
      "max-len": ["warn", { "code": 120, "tabWidth": 2, "ignoreComments": true }],
    },
  },
];
