const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// SDK 54 doesn't have the newer "on-demand filesystem" pnpm-symlink resolution
// (added in SDK 56+), so the pnpm virtual store's symlinked packages need to be
// pointed at explicitly, otherwise Metro's resolver mis-resolves paths on Windows.
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
config.resolver.unstable_enableSymlinks = true;

module.exports = config;
