import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

function createESMConfig(input, output, production) {
  return defineConfig({
    input,
    output: { file: output, format: 'esm' },
    plugins: [
      typescript({
        tsconfig: 'tsconfig.json',
        useTsconfigDeclarationDir: true,
      }),
      production
        ? terser({
            compress: {
              pure_getters: true,
              unsafe: true,
              unsafe_comps: true,
              warnings: false,
            },
            format: {
              comments: RegExp(`${pkg.name}`),
            },
          })
        : [],
    ],
  })
}

function createUMDConfig(input, output, production) {
  return defineConfig({
    input,
    output: { file: output, format: 'umd', name: pkg.name },
    plugins: [
      typescript({
        tsconfig: 'tsconfig.json',
        useTsconfigDeclarationDir: true,
      }),
      production
        ? terser({
            compress: {
              pure_getters: true,
              unsafe: true,
              unsafe_comps: true,
              warnings: false,
            },
            format: {
              comments: RegExp(`${pkg.name}`),
            },
          })
        : [],
    ],
  })
}

function createIifeConfig(input, output, production) {
  return defineConfig({
    input,
    output: { file: output, format: 'iife', name: pkg.name },
    plugins: [
      typescript({
        tsconfig: 'tsconfig.json',
        useTsconfigDeclarationDir: true,
      }),
      production
        ? terser({
            compress: {
              pure_getters: true,
              unsafe: true,
              unsafe_comps: true,
              warnings: false,
            },
            format: {
              comments: RegExp(`${pkg.name}`),
            },
          })
        : [],
    ],
  })
}

export default function () {
  const input = 'src/index.ts'
  return [
    createESMConfig(input, `dist/es/index.js`, false),
    createESMConfig(input, `dist/es/index.min.js`, true),
    createUMDConfig(input, `dist/umd/index.js`, false),
    createUMDConfig(input, `dist/umd/index.min.js`, true),
    createIifeConfig(input, `dist/iife/index.js`, false),
    createIifeConfig(input, `dist/iife/index.min.js`, true),
  ]
}
