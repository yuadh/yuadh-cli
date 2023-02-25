// .eslintrc.js
console.log(" INFO  读取了: .eslintrc.js");
module.exports = {
  extends: [
    "airbnb-base", // airbnb要求字符串是单引号
    "plugin:prettier/recommended", // 新增，必须放在最后面
  ],
  plugins: ["prettier"],
  rules: {
    // semi: [2, "never"],
    "prettier/prettier": "error",
  },
};
