const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const glob = require("glob");
const ChunkPathPlugin = require("./chunkPathPlugin");
const TerserPlugin = require("terser-webpack-plugin");

// const entry = () => {
//   const entries = {};
//   const files = glob.sync("./src/**/*.{js,ts,tsx}");
//   files.forEach((file) => {
//     const relativePath = path
//       .relative("./src", file)
//       .replace(/\.(js|ts|tsx)$/, "");
//     entries[relativePath] = file;
//   });
//   console.log("Entry map:", entries);
//   return entries;
// };

const entries = {};
glob.sync("./src/**/*.{ts,tsx,js}").forEach((file) => {
  const name = file
    .replace(/^\.\/src\//, "") // 去掉 src/
    .replace(/\.(tsx?|js)$/, ""); // 去掉扩展名
  entries[name] = file;
});

module.exports = {
  // 自动扫描 src 下所有 js 文件作为入口（保持路径结构）
  entry: {
    main: "./src/index.tsx",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js", // 保留路径 + hash
    path: path.resolve(__dirname, "dist"),
    chunkFilename: "[name].js",
    clean: true, // 每次构建清空 dist
    publicPath: "/", // 如果要动态加载 chunk，需正确设置
  },

  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },

  plugins: [new ChunkPathPlugin()],

  optimization: {
    minimize: false, // 关闭代码压缩
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: false, // 不压缩
          mangle: false, // 不混淆
        },
        extractComments: false, // 不提取注释
      }),
    ],
    splitChunks: false, // ❗ 关键：不自动拆 vendor
    runtimeChunk: false,
    // chunkIds: "named",
    // chunkIds: "named", // 不用数字 ID，而是路径名
    // moduleIds: "named",
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    preferRelative: true, // 👈 加这个
  },
  experiments: {
    outputModule: false,
  },

  mode: "production",
  // devtool: "source-map",
};
