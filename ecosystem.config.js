module.exports = {
  apps : [{
    name: "Indexer",
    script: 'dist/listenerCreator/listener.service.js',
    instances: 2,
  }],
};
