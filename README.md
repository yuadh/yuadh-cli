---
title: 项目搭建——代码规范篇
date: 2023-02-25 09:14:01
categories:
  - lint
tags:
  - lint
---

## 项目搭建——代码规范篇

学习怎么搭建一套自己的项目脚手架

**代码规范篇**

- Eslint + prettier（代码规范+代码格式化）

- husky + lint-staged（git hooks 工具+暂存文件 lint）
- commitizen + commitlint （提交规范辅助+提交规范检查）
- standard-version（项目自动更新）

## 前置 eslint 和 prettier

在 `vscode` 插件中，安装 `eslint` 和 `prettier` 插件，会有所冲突。 而且插件自带一些配置，直接使用会导致代码格式的混乱。这里我们从 0 到 1 简单梳理下 `eslint` 和 `prettier` 的用法

假设 `eslintrc.js` 使用了 `airbnb` 规范 ，

```js
//.eslintrc.js
module.exports = {
  extends: ["airbnb-base"],
};
```

此时项目就应用了 `airbnb` 规范，如果未按照其代码规范来写执行 `lint` 检查命令时会报错

```js
npx eslint --config ./eslintrc.js a.js
```

同样配置 `.prettierrc.js` 配置文件，简单配置规则

```js
// .prettierrc.js
module.exports = {
  singleQuote: false, // 默认为false。即要求：const a = "1";，可改为true，即要求const a = '1';
};
```

此时项目就会按配置好的规则格式化代码

**需要注意的是**， 以上是 `vscode` 使用的插件应用层面的格式化检查，这是编辑器的行为。想要在不同编辑器环境下使用 `elint` 和 `prettier` 需要安装相关依赖包

```js
npm i eslint -D
```

```js
npm i pretter -D
```

想要解决冲突问题还需要安装一个插件 `eslint-plugin-prettier`

即能使 `eslint` 的规则生效，又能使 `prettier` 规则生效。直白说就是，**让 prettier 作为 eslint 的插件，让 eslint 集中校验**，但这样做可能会有冲突问题后文有个 config 插件可以解决这个问题

```js
npm i eslint-plugin-pretteir prettier
```

在 elint 配置文件中引入

```js
// .eslintrc.js
console.log(" INFO  读取了: .eslintrc.js");
module.exports = {
  extends: [
    "airbnb-base", // airbnb要求字符串是单引号
  ],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
  },
};
```

命令行使用 prettier：`npx prettier --write index.js`

而在实际编辑器中，代码格式化的方式是遵守 `prettier` ，代码规范校验是根据 `eslint` 来的。`prettier` 向 `eslint` 妥协。但是如果要 eslint 的配置向 prettier 妥协，可以在 eslint 的配置文件中，修改 `rele` 规则对齐 prettier， `rules` 规则优先级别最高会覆盖上面配置好的文件

**eslint-config-prettier**，如果 `eslint` 和 `prettier` 的规则冲突地方很多，就很难去手动修改。 这时候就可以使用到 `eslint-config-prettier` 插件解决这个问题

`yarn add eslint-config-prettier` 插件，修改下 `eslint` 的相关配置

```js
// .eslintrc.js
console.log(" INFO  读取了: .eslintrc.js");
module.exports = {
  extends: [
    "airbnb-base", // airbnb要求字符串是单引号
    "plugin:prettier/recommended", // 这个插件一定要放在最后
  ],
};
```

当我们把 `prettierrc.js` 的校验规则 `singleQueto:false` 使用单引号

```js
// a.js
const a = "1";
```

```js
➜  utils git:(master) ✗ npx eslint --config ./.eslintrc.js a.js
 INFO  读取了: .eslintrc.js
 INFO  读取了: .eslintrc.js
 INFO  读取了: .prettierrc.js

/Users/huangshuisheng/Desktop/hss/github/billd/packages/utils/a.js
  1:7   error  'a' is assigned a value but never used  no-unused-vars
  1:15  error  Insert `⏎`                              prettier/prettier

✖ 2 problems (2 errors, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.

➜  utils git:(master) ✗
```

在 `eslint` 校验中，是 prettier 的配置生效。我们再修改为单引号看看效果

```js
➜  utils git:(master) ✗ npx eslint --config ./.eslintrc.js a.js
 INFO  读取了: .eslintrc.js
 INFO  读取了: .eslintrc.js
 INFO  读取了: .prettierrc.js

/Users/huangshuisheng/Desktop/hss/github/billd/packages/utils/a.js
  1:7   error  'a' is assigned a value but never used  no-unused-vars
  1:11  error  Replace `'1';` with `"1";⏎`             prettier/prettier

✖ 2 problems (2 errors, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.

➜  utils git:(master) ✗
```

可以看出这个插件的效果就是，关闭所有相关的 eslint 规则的代码校验，意思是如果有冲突就是用 `prettier` 的代码规范。这样就解决了 `eslint` 和 `prettier` 的冲突问题

**总结**

这里我们可以总括下 `eslint` 和 `prettier` 两个工具的最佳实践，首先安装四个包

```js
yarn add eslint eslint-plugin-prettier eslint-config-prettier prettier -D
```

初始化：

```js
eslint init
```

在 `eslint` 配置文件中，引入

```js
// .eslintrc.js
module.exports = {
  extends: [
    // ...
    "plugin:prettier/recommended", // 这个插件一定要放在最后
  ],
};
```

这样即遵守了 `eslint` 的代码规范，又能根据 `prettier` 的配置去规范团队自己的代码风格

- 更多 `Eslint` 和 `prettier` 的用法关注官网

eslint 代码规范参考

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
  },
  extends: [
    "airbnb-base", // airbnb的eslint规范，indent：2，即一个缩进两个空格，qutoes：single，即单引号，max-len：一行100
    "plugin:vue/strongly-recommended", // 强烈推荐（提高可读性）
    "plugin:prettier/recommended", // prettierrc配置文件声明了singleQuote:true,即单引号，printWidth：80，即一行80，且prettier默认一个缩进四个空格
  ],

  parserOptions: {
    // parser: 'vue-eslint-parser', // https://eslint.vuejs.org/
    // parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    // 'vue',
    // '@typescript-eslint',
    // 'prettier',
    // 'plugin:prettier/recommended', // error！！！巨坑，这个写错位置了，应该是写在extends里面的！！！！
    // '@typescript-eslint/tslint',
    "import",
  ],
  overrides: [
    {
      files: ["*.ts", "*tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        // parser: 'vue-eslint-parser',
        // ecmaVersion: 12,
        // parser: '@typescript-eslint/parser',
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: ["@typescript-eslint"],
      extends: ["plugin:@typescript-eslint/recommended"],
    },
  ],
  // rules优先级最高，会覆盖上面的
  rules: {
    /**
     * 0 => off
     * 1 => warn
     * 2 => error
     */
    "class-methods-use-this": 0, // 类方法如果不使用this的话会报错
    "no-restricted-syntax": [
      // airbnb默认禁用了一些语法
      1,
      // 'FunctionExpression',
      // 'ForInStatement',
      { selector: "ForInStatement", message: "不建议使用for in" },
    ],
    "guard-for-in": 0, // 当for in循环不使用if语句过滤其结果时，它会发出警告
    "no-nested-ternary": 0, // 禁止嵌套三元
    "no-plusplus": 0,
    "arrow-body-style": [1, "as-needed"], // 在可以省略的地方强制不使用大括号（默认）
    "global-require": 1, // 此规则要求所有调用require()都在模块的顶层，类似于 ES6import和export语句，也只能在顶层发生。
    "no-shadow": 0,
    "no-undef": 0, // https://github.com/typescript-eslint/typescript-eslint/issues/2528#issuecomment-689369395
    "no-param-reassign": 0,
    "func-names": 0, // 不能是匿名函数
    "spaced-comment": 2, // 此规则将在注释//或开始后强制执行间距的一致性/*
    "no-underscore-dangle": 0, // Unexpected dangling '_' in '_xxx'
    "vars-on-top": 0, // 要求var声明位于其作用域的顶部
    "prefer-rest-params": 0, // 此规则旨在标记arguments变量的使用
    "prefer-const": 1, // xxx is never reassigned. Use 'const' instead，此规则旨在标记使用let关键字声明的变量
    "no-unused-vars": 1, // xxx is assigned a value but never used，此规则旨在消除未使用的变量、函数和函数参数
    "no-var": 1, // Unexpected var, use let or const instead，该规则旨在阻止使用var或鼓励使用const或let代替。
    "no-console": 0, // 此规则不允许调用console对象的方法。
    // 'no-console': process.env.NODE_ENV !== 'production' ? 0 : 2, // 此规则不允许调用console对象的方法。
    "no-redeclare": 2, // 此规则旨在消除在同一范围内具有多个声明的变量。
    "no-unused-expressions": [2, { allowShortCircuit: true }], // 期望一个赋值或函数调用，却看到了一个表达式，允许&&
    "array-callback-return": [2, { allowImplicit: false }], // expects a return value from arrow function.期望箭头函数的返回值。

    "vue/attribute-hyphenation": 0, // 此规则强制在 Vue 模板中的自定义组件上使用带连字符的属性名称。

    // eslint-plugin-import插件
    "import/order": [
      2,
      {
        groups: [
          "builtin",
          "external",
          "internal",
          ["sibling", "parent"],
          "index",
          "object",
          "type",
        ],
        "newlines-between": "always", // 强制或禁止导入组之间的新行：
        // 根据导入路径按字母顺序对每个组内的顺序进行排序
        alphabetize: {
          order: "asc" /* 按升序排序。选项：['ignore', 'asc', 'desc'] */,
          caseInsensitive: false /* 忽略大小写。选项：[true, false] */,
        },
      },
    ],
    "import/newline-after-import": 1, // 强制在最后一个顶级导入语句或 require 调用之后有一个或多个空行
    "import/extensions": 0, // 省略导入源路径中的文件扩展名
    "import/no-unresolved": 0, // 导入资源的时候没有后缀会报这个错，这里关掉他
    "import/prefer-default-export": 0, // 当模块只有一个导出时，更喜欢使用默认导出而不是命名导出。
    "import/no-extraneous-dependencies": 0, // 开发/生产依赖混乱
  },
};
```

prettier 参考规范

```js
const chalk = require("chalk");

console.log(
  `${chalk.bgBlueBright.black(" INFO ")} ${chalk.blueBright(
    `读取了: ${__filename.slice(__dirname.length + 1)}`
  )}`
);

module.exports = {
  bracketSpacing: true, // 默认为true,即{ foo: bar }；可改为false，即{foo: bar}
  singleQuote: true, // 默认为false,即{foo:"bar"}，可改为true，即{foo:'bar'}
  bracketSameLine: false, // https://prettier.io/blog/2021/09/09/2.4.0.html
  // jsxBracketSameLine: false, // true：将多行JSX元素的 > 放在最后一行的末尾。false：将多行JSX元素的 > 单独放在下一行
  trailingComma: "es5", // 默认"es5"：在ES5中有效的尾随逗号（对象、数组等）。可选："none"：没有尾随逗号；"all"：尽可能尾随逗号
  printWidth: 80, // 默认80,printWidth不是硬性的允许行长度上限，不要试图将 printWidth 当作 ESLint 的max-len 来使用——它们不一样
  // parser: 'babel',
};
// prettier默认1个缩进4个空格，即换行后，前面要有四个空格
```

注意忽略文件的配置

**需要注意的是**，`rule` 里的优先级最高， `prettier `配置最好遵循规则

## husky 和 lint-staged

在上面的 `ESlint` 和 `Prettier` 的配置中，已经有了代码规范约定的工具。但是在没有通过校验的情况下，能将未规范的代码推送到远程仓库，这样代码规范工具就没意义了。于是我们在 `git` 工作流上做一些限制，从而保证提交的代码是符合相关规范的。下面要介绍两个工具包

- husky（可以操作 git 各个阶段的钩子，在暴露出的钩子中去触发一些命令）
- lint-staged（过滤文件，只对暂存区的文件执行 lint）

**husky**较为常用的两个钩子

- `pre-commit`， 在 git commit 执行前执行 `lint-staged`
- `commit-mgs`，在 git commit 执行后执行 `commitlint`（后文）

现在先按照 `husky` git 钩子工具库，它能在 git 钩子的个个阶段执行一些脚本

```js
yarn add husky -D
npx husky-init
```

这个步骤会将工具库下载，然后根目录下创建 `.husky` 文件夹，以及创建 `pre-commit` 钩子与相关执行脚本，为项目添加一个脚本 `prepare:husky install`

我们可以将这个执行脚本换为 `eslint` 检查命令

`eslint --fix ./src --exc .vue,.js,.ts`

这样在每次对 git 进行 commit 提交时都会执行这个脚本文件。**注意：** 此时会有一个问题，每次提交都会对项目的所有文件进行校验，这无疑造成了不必要的检测浪费了大量的时间。因此我们这里要借助到一个工具 `lint-staged` 工具包，与这个包配合使用能仅对暂存区的文件进行校验。我们需要对这个包进行一些配置（这个可以写在 package 包中，也能单独写在配置文件中`.lintstagedrc.js `）

```js
"lint-staged":{
  "*.{vue,js,ts}":"eslint --fix"
}
```

把之前的 `eslint` 执行脚本，换成 `npx lint-staged`

这样每次 `git commit` 执行前，就会执行 `lint-staged` 对暂存区的文件进行校验啦

```pre-commit
npx --no-install lint-staged
```

**需要注意的是，** `lint-stateg` 如果没有配置正确，很可能不能正常启动检查

```js
"lint-staged": {
    "**/*.{js,jsx,ts,tsx}": "eslint --ext .js,.jsx,.ts,.tsx "
 },
 "scripts": {
    "prepare": "husky install",
    "lint-staged": "lint-staged"
  }
```

注意添加脚本命令，以及在 `pre-commit` 里使用它

```js
npx --no-install lint-staged
```

## commitizen 和 commitlint

上面已经将 `commit` 之前的代码做了检查，但是还能更规范的统一代码格式。这里我们在 `commit` 提交上也规范起来，在后面项目开发时就能够更加清晰的查看所有的提交记录，精准定位提交信息。那么我们该怎么去规范代码的提交呢信息呢，这里我们可以去学习下企业级的代码提交规范是如何做的。

以 `angular` 为例，可以看到 `Angular` 的 `commit message` 由三部分组成。

```
<Header>
<Body>
<Footer>
```

**Header**， 包含三个字段 `type（必须） / scope（可选） / subject（必须）`

- **type**

| 值       | 描述                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| feat     | 新增一个功能                                                                                                                        |
| fix      | 修复一个 Bug                                                                                                                        |
| docs     | 文档变更                                                                                                                            |
| style    | 代码格式（不影响功能，例如空格、分号等格式修正）                                                                                    |
| refactor | 代码重构                                                                                                                            |
| perf     | 改善性能                                                                                                                            |
| test     | 测试                                                                                                                                |
| build    | 变更项目构建或外部依赖（例如 scopes: webpack、gulp、npm 等）                                                                        |
| ci       | 更改持续集成软件的配置文件和 package 中的 scripts 命令，例如 scopes: Travis, Circle 等 chore 变更构建流程或辅助工具 revert 代码回退 |
| chore    | 变更构建流程或辅助工具                                                                                                              |
| revert   | 代码回退                                                                                                                            |

- **scope** ， scope 用于指定本次 commit 影响的范围。scope 依据项目而定，例如在业务项目中可以依据菜单或者功能模块划分，如果是组件库开发，则可以依据组件划分。（scope 可省略）

- **subject**， 是本次 commit 的简洁描述，长度约定在 50 个字符以内，通常遵循以下几个规范：
  - 用动词开头，第一人称现在时表述，例如：change 代替 changed 或 changes
  - 第一个字母小写
  - 结尾不加句号（.）

**Body**

body 是对本次 commit 的详细描述，可以分成多行。（body 可省略）

跟 subject 类似，用动词开头，body 应该说明修改的原因和更改前后的行为对比。

**Footer**

如果本次提交的代码是突破性的变更或关闭缺陷，则 Footer 必需，否则可以省略。

来看几个示例：

**feat**

```js
feat(browser): onUrlChange event (popstate/hashchange/polling)

Added new event to browser:
- forward popstate event if available
- forward hashchange event if popstate not available
- do polling when neither popstate nor hashchange available

Breaks $browser.onHashChange, which was removed (use onUrlChange instead)
```

**fix**

```js
fix(compile): couple of unit tests for IE9

Older IEs serialize html uppercased, but IE9 does not...
Would be better to expect case insensitive, unfortunately jasmine does
not allow to user regexps for throw expectations.

Closes #392
Breaks foo.bar api, foo.baz should be used instead
```

**style**

```js
style(location): add couple of missing semi colons
```

**chore**

```js
chore(release): v3.4.2
```

可以看出完全遵守 `Angular` 的规范会觉得冗余，其实不然。如果每次都严格按照其提交规范，有利于项目健壮性等。使用 `commit message` 的好处在于

- 首行就是简洁实用的关键信息，方便在 git history 中快速浏览。

- 具有更加详细的 body 和 footer，可以清晰的看出某次提交的目的和影响。

- 可以通过 type 过滤出想要查找的信息，也可以通过关键字快速查找相关提交。

- 可以直接从 commit 生成 change log。

那么 commit 有如此多的好处，是否有相关工具可以辅助我们进行相关操作呢。答案是有的 我们可以借助 `Commitizen` 来实现提交规范

安装步骤

- `yarn add commitizen -D` （规范工具）
- `npx commitizen init cz-conventional-changelog --save-dev --save-exact` (安装并使用 CLI 集成命令简化操作)
- 将提交命令改为 `git cz`
- 如果觉得 `cz` 的初始命令不符合需求，可以使用用户自定义的包 `npx commitizen init cz-customizable --save-dev --save-exact --force`

推荐命令

```js
module.exports = {
  // type 类型（定义之后，可通过上下键选择）
  types: [
    { value: 'feat', name: 'feat:     新增功能' },
    { value: 'fix', name: 'fix:      修复 bug' },
    { value: 'docs', name: 'docs:     文档变更' },
    { value: 'style', name: 'style:    代码格式（不影响功能，例如空格、分号等格式修正）' },
    { value: 'refactor', name: 'refactor: 代码重构（不包括 bug 修复、功能新增）' },
    { value: 'perf', name: 'perf:     性能优化' },
    { value: 'test', name: 'test:     添加、修改测试用例' },
    { value: 'build', name: 'build:    构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）' },
    { value: 'ci', name: 'ci:       修改 CI 配置、脚本' },
    { value: 'chore', name: 'chore:    对构建过程或辅助工具和库的更改（不影响源文件、测试用例）' },
    { value: 'revert', name: 'revert:   回滚 commit' }
  ],

  // scope 类型（定义之后，可通过上下键选择）
  scopes: [
    ['components', '组件相关'],
    ['hooks', 'hook 相关'],
    ['utils', 'utils 相关'],
    ['element-ui', '对 element-ui 的调整'],
    ['styles', '样式相关'],
    ['deps', '项目依赖'],
    ['auth', '对 auth 修改'],
    ['other', '其他修改'],
    // 如果选择 custom，后面会让你再输入一个自定义的 scope。也可以不设置此项，把后面的 allowCustomScopes 设置为 true
    ['custom', '以上都不是？我要自定义']
  ].map(([value, description]) => {
    return {
      value,
      name: `${value.padEnd(30)} (${description})`
    }
  }),

  // 是否允许自定义填写 scope，在 scope 选择的时候，会有 empty 和 custom 可以选择。
  // allowCustomScopes: true,

  // allowTicketNumber: false,
  // isTicketNumberRequired: false,
  // ticketNumberPrefix: 'TICKET-',
  // ticketNumberRegExp: '\\d{1,5}',


  // 针对每一个 type 去定义对应的 scopes，例如 fix
  /*
  scopeOverrides: {
    fix: [
      { name: 'merge' },
      { name: 'style' },
      { name: 'e2eTest' },
      { name: 'unitTest' }
    ]
  },
  */

  // 交互提示信息
  messages: {
    type: '确保本次提交遵循 Angular 规范！\n选择你要提交的类型：',
    scope: '\n选择一个 scope（可选）：',
    // 选择 scope: custom 时会出下面的提示
    customScope: '请输入自定义的 scope：',
    subject: '填写简短精炼的变更描述：\n',
    body:
      '填写更加详细的变更描述（可选）。使用 "|" 换行：\n',
    breaking: '列举非兼容性重大的变更（可选）：\n',
    footer: '列举出所有变更的 ISSUES CLOSED（可选）。 例如: #31, #34：\n',
    confirmCommit: '确认提交？'
  },

  // 设置只有 type 选择了 feat 或 fix，才询问 breaking message
  allowBreakingChanges: ['feat', 'fix'],

  // 跳过要询问的步骤
  // skipQuestions: ['body', 'footer'],

  // subject 限制长度
  subjectLimit: 100
  breaklineChar: '|', // 支持 body 和 footer
  // footerPrefix : 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true,
}
```

然而事实上，对于非大性项目而且不需要这么多的冗余 message 细节。一般情况下，我们仅使用 `header` 部分信息即可。即 `type(scope):subject` （类型(影响范围)：主题）

**commitlint**

上面虽然对 commit 提交做了辅助，但是仍旧能绕过直接 `git commit` 提交不符合规范的代码。可以在 `commit-msg` 的钩子上添加我们的 commit lint。

- `yarn add @commitlint/config-conventional @commitlint/cli -D`

- 借助 `@commitlint/config-conventional` 和 `@commitlint/cli` 来实现

第一个包是检查提交规程是否遵循 `Angular` 的提交规范，第二个包是命令集包

在根目录下创建 `commitlint.config.js` 文件夹。写入 `module.exports = { extends: ['@commitlint/config-conventional'] }` ，表示使用该规范来检查提交 message

最后一步，将检查命令加入到 `huksy` 的 `commit-msg` 钩子函数中

测试未提交规范，会有如下报错

![1677328230675.png](http://img.yuadh.com/imgs/2023/02/25/1677328230675.png)

## 总结

以上就是代码规范篇的内容。可以看出整个配置过程有非常多的配置，从项目工程化的角度来看是有利的，但是往往我们在开发中需要减少如此多的束缚才能提高开发效率。总的来说还是看项目需求，看是否有必要用到这些东西，可以根据需求的添加和删除配置。下面推荐几个代码规范，可以向优秀开源项目学习代码规范

- [umijs/fabric: 💪 严格但是不严苛的编码规范 (github.com)](https://github.com/umijs/fabric)
- [从 0 开始手把手带你搭建一套规范的 Vue3.x 项目工程环境 - 掘金 (juejin.cn)](https://juejin.cn/post/6951649464637636622#heading-15)

**todo：**

- 集成项目构建工具：webpack、vite
- 集成基建组件库：ant design
- 集成测试工具：jest
- 集成自动化部署：jenkins 、 CICD
