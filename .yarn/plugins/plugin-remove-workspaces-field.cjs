module.exports = {
  name: `plugin-remove-workspaces-field`,
  factory: () => ({
    hooks: {
      beforeWorkspacePacking(workspace, rawManifest) {
        delete rawManifest.workspaces;
      },
    },
  }),
};
