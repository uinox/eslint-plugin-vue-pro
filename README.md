# eslint-plugin-vue-pro

## Installation

You'll first need to install [ESLint](https://eslint.org) [eslint-plugin-vue](https://eslint.vuejs.org):

```sh
npm i eslint@8 eslint-plugin-vue --save-dev
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
    "plugins": ["vue-pro"]
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
                "suffixes": ["Submit"],
                "caseType": "camelCase", //['kebab-case', 'camelCase']
                "maxLen": 20
            }
        ],
        "vue-pro/css-naming": [
            "error",
            {
                "caseType": "kebab-case", // ['camelCase', 'kebab-case']
                "ignores": ["el-"], //
            }
        ],
        "vue-pro/constant-naming": [
            "error",
            {
                "pattern": /^[A-Z][A-Z_]*[A-Z]$/, // CONFIG_IMGURL
            }
        ],
    }
}
```