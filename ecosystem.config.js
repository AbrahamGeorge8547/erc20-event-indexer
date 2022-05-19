module.exports = {
  apps : [{
    name: "Indexer",
    script: 'dist/listnerCreator/listner.service.js',
    instances: 2,
  }],
};
