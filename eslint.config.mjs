import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // eslint-plugin-react-hooks 7 (via eslint-config-next 16) adds React Compiler rules that 15 did not run.
    // set-state-in-effect flags the deliberate post-hydration mount flag (useMotionAllowed, useScenePlayback):
    // useReducedMotion() is null on the server, so the client must flip state after mount.
    // refs flags every read of the useScenePlayback() result because it carries a ref alongside plain values.
    // The React Compiler is not enabled here; revisit these if it is.
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  },
  globalIgnores([
    "node_modules/**",
    ".next/**",
    ".next-verification/**",
    "test-results/**",
    "playwright-report/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
