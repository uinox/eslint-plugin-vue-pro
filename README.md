# eslint-plugin-vue-pro

## Installation

You'll first need to install [ESLint](https://eslint.org) [eslint-plugin-vue](https://eslint.vuejs.org):

```sh
npm i eslint@8 eslint-plugin-vue vue-eslint-parser --save-dev
```

Next, install
`eslint-plugin-vue-pro`:

```sh
npm install eslint-plugin-vue-pro --save-dev
```

# Usage

### `eslintrc`

Add `vue-pro` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "parser": "vue-eslint-parser",
    "plugins": ["vue-pro"],
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "vue-pro/handle-event-naming": [
            "error",
            {
                "prefixes": ["handle", "on"],
                // "suffixes": ["Submit"],
                "caseType": "camelCase", //['kebab-case', 'camelCase']
                "maxLen": 20
            }
        ],
        "vue-pro/css-naming": [
            "error",
            {
                "caseTypes": ["kebab-case", "snake_case"], // ['camelCase', 'kebab-case', 'snake_case']
                "ignores": ["el-"]
            }
        ],
        "vue-pro/constant-naming": [
            "error",
            {
                "pattern": /^[A-Z][A-Z_]*[A-Z]$/, // eg: CONFIG_IMGURL
            }
        ],
        "vue-pro/check-file": [
            "error",
            {
                "caseTypes": ["PASCAL_CASE"], //['camelCase', 'snake_case', 'PASCAL_CASE']
                "fileTypes": ["vue"],
                "ignores": ["index"]
            }
        ]
    }
}
```