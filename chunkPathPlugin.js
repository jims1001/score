const path = require("path");

class ChunkPathPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("ChunkPathPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "ChunkPathPlugin",
          stage: compilation.constructor.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        (assets) => {
          for (const chunk of compilation.chunks) {
            if (!chunk.canBeInitial()) {
              for (const file of chunk.files) {
                const modules = Array.from(chunk.modulesIterable);
                const mainModule = modules.find((m) => m.resource);

                if (mainModule) {
                  const relativePath = path.relative(
                    compiler.context,
                    mainModule.resource
                  );

                  const newFilePath = relativePath.replace(
                    /\.(ts|tsx|js)$/,
                    ".js"
                  );

                  // 替换 asset 路径
                  const asset = assets[file];
                  delete assets[file];
                  assets[newFilePath] = asset;
                }
              }
            }
          }
        }
      );
    });
  }
}

module.exports = ChunkPathPlugin;
