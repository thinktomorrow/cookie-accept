module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        'jest/globals': true,
    },
    plugins: ['jest'],
    extends: ['airbnb-base', 'eslint:recommended'],
    rules: {
        indent: ['error', 4],
        'comma-dangle': [
            'error',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                functions: 'never',
            },
        ],
        'max-len': ['error', 120],
        'no-param-reassign': [2, { props: false }],
        'wrap-iife': 0,
        'func-names': 0,
        'no-plusplus': 0,
        'no-restricted-syntax': 0,
        'no-underscore-dangle': 0,
        'object-curly-newline': 0,
        'import/no-extraneous-dependencies': 0,
        'global-require': 0,
        'max-classes-per-file': 0,

        // Turned this rule off because of conflict with prettier formatting operators at the end of a line.
        'operator-linebreak': 0,

        // 'no-new': process.env.NODE_ENV === 'production' ? 1 : 0,
        'no-new': 0,
        'no-console': process.env.NODE_ENV === 'production' ? 1 : 0,
        'no-alert': process.env.NODE_ENV === 'production' ? 1 : 0,
    },
};
