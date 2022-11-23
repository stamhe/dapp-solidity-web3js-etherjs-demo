module.exports = {
    env: {
        browser: true,
        node: true,
        es2020: true, // es2020 才内置全局支持 BigInt
    },
    // eslint:recommended, plugin:vue/essential, react-app
    // extends: ['eslint:recommended'],
    extends: [
        // 'eslint:recommended',
        // 'plugin:react/recommended',
        'react-app',
    ],
    overrides: [],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            // ES 其他特性
            jsx: true, // 如果是 React 项目，就需要开启 jsx 语法
        },
    },
    plugins: ['react'],
    // 具体检查规则 eslint.bootcss.com/docs/rules
    // "off" 或 0 - 关闭规则
    // "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
    // "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
    rules: {
        semi: 'off', // 使用分号
        'no-var': 'error', // 不能使用 var 定义变量
        'array-callback-return': 'warn', // 强制数组方法的回调函数中有 return 语句，否则警告
        'default-case': [
            'warn', // 要求 switch 语句中有 default 分支，否则警告
            { commentPattern: '^no default$' }, // 允许在最后注释 no default, 就不会有警告了
        ],
        // 我们的规则会覆盖掉默认如 react-app 的规则
        // 所以想要修改规则直接改就是了
        eqeqeq: [
            'warn', // 强制使用 === 和 !==，否则警告
            'smart', // https://eslint.bootcss.com/docs/rules/eqeqeq#smart 除了少数情况下不会有警告
        ],
    },
};
