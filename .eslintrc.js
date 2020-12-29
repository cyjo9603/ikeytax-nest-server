module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'no-useless-constructor': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'new-cap': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
  },
};
