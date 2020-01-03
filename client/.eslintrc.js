module.exports = {
    parser: 'babel-eslint',
    extends: ['airbnb', 'prettier', 'prettier/react'],
    plugins: [
        'prettier',
        'react',
        'jsx-a11y',
        'react-hooks'
    ],
    env: {
        jest: true,
        browser: true,
        node: true,
        es6: true
    },
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    rules: {
        'arrow-body-style': [2, 'as-needed'],
        'array-bracket-spacing': [
            'error',
            'always',
            { singleValue: false, objectsInArrays: false, arraysInArrays: false }
        ],
        'arrow-parens': ['error', 'always'],
        'class-methods-use-this': 0,
        'comma-dangle': [2, 'never'],
        'comma-spacing': ['error', { before: false, after: true }],
        'comma-style': ['error', 'last'],
        'computed-property-spacing': ['error', 'always'],
        'import/imports-first': 0,
        'import/newline-after-import': 0,
        'import/no-dynamic-require': 0,
        'import/no-extraneous-dependencies': 0,
        'import/no-named-as-default': 0,
        'import/no-unresolved': 2,
        'import/no-webpack-loader-syntax': 0,
        indent: ['error', 4, { "SwitchCase": 2 }],
        'jsx-a11y/aria-props': 2,
        'jsx-a11y/heading-has-content': 0,
        'jsx-a11y/label-has-associated-control': [2, { controlComponents: ['Input'] }],
        'jsx-a11y/mouse-events-have-key-events': 2,
        'jsx-a11y/role-has-required-aria-props': 2,
        'jsx-a11y/role-supports-aria-props': 2,
        'max-len': 0,
        'newline-per-chained-call': 0,
        'no-confusing-arrow': 0,
        'no-console': 1,
        'no-duplicate-imports': 'error',
        'no-extra-semi': 'error',
        'no-lonely-if': 'error',
        'no-mixed-operators': [
            0,
            {
                groups: [
                    ['+', '-', '*', '/', '%', '**'],
                    ['&', '|', '^', '~', '<<', '>>', '>>>'],
                    ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
                    ['&&', '||'],
                    ['in', 'instanceof']
                ],
                allowSamePrecedence: true
            }
        ],
        'no-multiple-empty-lines': ['error', { max: 1 }],
        'no-nested-ternary': 0,
        'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
        'no-trailing-spaces': 'error',
        'no-underscore-dangle': 0,
        'no-unneeded-ternary': 'error',
        'no-unused-expressions': [2, { allowShortCircuit: true, allowTernary: true }],
        'no-unused-vars': 2,
        'no-use-before-define': 0,
        'no-useless-constructor': 'error',
        'no-var': 'error',
        'object-curly-spacing': [
            'error',
            'always',
            { arraysInObjects: false, objectsInObjects: false }
        ],
        'prefer-arrow-callback': 'error',
        'prefer-const': 'error',
        'prefer-template': 2,
        'react/destructuring-assignment': 0,
        'react/jsx-closing-tag-location': 0,
        'react/jsx-curly-spacing': [2, 'always', { spacing: { objectLiterals: 'never' } }],
        'react/forbid-prop-types': 0,
        'react/jsx-first-prop-new-line': [2, 'multiline'],
        'react/jsx-filename-extension': 0,
        'react/jsx-indent': [2, 4],
        'react/jsx-indent-props': [2, 4],
        'react/jsx-no-target-blank': 0,
        'react/jsx-uses-vars': 2,
        'react/require-default-props': 0,
        'react/require-extension': 0,
        'react/self-closing-comp': 0,
        'react/sort-comp': 0,
        'require-yield': 0,
        'require-jsdoc': [
            'error',
            {
                require: {
                    FunctionDeclaration: true,
                    MethodDefinition: false,
                    ClassDeclaration: false,
                    ArrowFunctionExpression: false
                }
            }
        ],
        'semi-spacing': ['error', { before: false, after: true }],
        'space-in-parens': ['error', 'always', { exceptions: ['{}', '[]', '()', 'empty'] }],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn'
    },
    settings: {
        'import/resolver': {
            node: {
                paths: ['src']
            }
        }
    }
};
