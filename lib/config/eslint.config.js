
"use strict";

// https://alloyteam.github.io/eslint-config-alloy/
module.exports = {
  extends: [require.resolve('eslint-config-alloy')],
  globals: {// 这里填入你的项目需要的全局变量
    // 这里值为 false 表示这个全局变量不允许被重新赋值，比如：
    //
    // jQuery: false,
    // $: false
  },
  "parser": require.resolve("babel-eslint"),
  rules: {
    // 定义过的变量未使用使用时告警
    'no-unused-vars': ['warn', {
      vars: 'all',
      args: 'none',
      caughtErrors: 'none',
      ignoreRestSiblings: true
    }],
    // 禁止将常量作为分支条件判断中的测试表达式，但允许作为循环条件判断中的测试表达式
    'no-constant-condition': ['warn', {
      checkLoops: false
    }],
    // 必须使用 === 或 !==，禁止使用 == 或 !=，与 null 比较时除外
    'eqeqeq': 'warn',
    // @fixable 禁止使用 !! ~ 等难以理解的运算符
    // 仅允许使用 !!
    'no-implicit-coercion': ['warn', {
      allow: ['!!']
    }],
    // @fixable 结尾必须有分号
    'semi': ['warn', 'always', {
      omitLastInOneLineBlock: true
    }],
    // 禁止在全局作用域下定义变量或申明函数
    'no-implicit-globals': 'warn',
    // 禁止使用没必要的 {} 作为代码块
    'no-lone-blocks': 'warn',
    // 禁止出现 location.href = 'javascript:void(0)';
    // @off 有时候需要用便捷的 javascript:;
    'no-script-url': 'off',
    // 对象字面量只有一行时，大括号内的首尾必须有空格
    // @off 没有必要限制
    'object-curly-spacing': 'off',
    // 禁止对函数的参数重新赋值
    // @warn 警示即可
    'no-param-reassign': 'warn',
    // 代码块嵌套的深度禁止超过 10 层
    // @warn 有些特殊情况会出现  警示即可
    'max-depth': ['warn', 10],
    // 禁止函数的循环复杂度超过 100
    // @error 最大值可以宽松点
    'complexity': ['error', {
      max: 40
    }],
    // 在ES5中需使用var
    // @off 没有必要限制
    'no-var': 'off',
    // 函数的参数禁止超过10个
    // @warn 警示即可
    'max-params': ['warn', 10],
    // 回调函数嵌套禁止超过 5 层
    // @warn 警示即可
    'max-nested-callbacks': ['warn', 5],
    // Promise 的 reject 中必须传入 Error 对象
    // @off 不需要限制
    'prefer-promise-reject-errors': 'warn',
    // 禁止变量申明时用逗号一次申明多个
    'one-var': 'off',
    // @fixable 变量申明必须每行一个
    'one-var-declaration-per-line': ['warn', 'always'],
    // @fixable 一个缩进必须用四个空格替代
    'indent': ['off', 4, {
      SwitchCase: 1,
      flatTernaryExpressions: true
    }],
    // @fixable 禁止出现连续的多个空格，除非是注释前，或对齐对象的属性、变量定义、import 等
    'no-multi-spaces': ['warn', {
      ignoreEOLComments: true,
      exceptions: {
        Property: true,
        BinaryExpression: false,
        VariableDeclarator: true,
        ImportDeclaration: true
      }
    }],
    // @fixable if 后面必须要有 {，除非是单行 if
    'curly': ['warn', 'multi-line', 'consistent'],
    // @fixable 禁止 if 后面不加大括号而写两行代码
    'nonblock-statement-body-position': ['warn', 'beside', {
      overrides: {
        while: 'below'
      }
    }],
    // @fixable 关键字前后必须有空格
    'keyword-spacing': 'off',
    // @fixable 小括号内的首尾禁止有空格
    'space-in-parens': ['off', 'never'],
    // @fixable 禁止行尾有空格
    'no-trailing-spaces': 'off',
    'spaced-comment': 'off',
    'quotes': 'off',
    'space-before-blocks': 'off',
    'no-tabs': 'off',
    'arrow-spacing': 'warn',
    'comma-spacing': 'warn',
    'key-spacing': 'warn'
  }
};