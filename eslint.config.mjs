import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
        ignores: ['.next/**', 'node_modules/**', 'drizzle/**'],
  },
    ...tseslint.configs.recommended,
  {
        rules: {
                // Il codice generato da v0 usa spesso 'any' implicito su risposte di API esterne:
          // segnaliamo come warning, non blocchiamo il build per questo.
          '@typescript-eslint/no-explicit-any': 'warn',
                '@typescript-eslint/no-unused-vars': 'warn',
        },
  },
  )
