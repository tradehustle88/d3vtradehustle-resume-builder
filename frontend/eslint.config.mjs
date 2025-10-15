// eslint.config.mjs

import next from "eslint-config-next";

export default [
  {
    ignores: [
      "node_modules",
      ".next/",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "api-functions/**",
    ],
  },
  ...next(),
  {
    rules: {
      // Change from "error" → "warn"
      "max-len": ["warn", { code: 120, tabWidth: 2, ignoreComments: true }],
      // Disable line ending checks to prevent CRLF/LF issues
      "linebreak-style": "off",
    },
  },
];
