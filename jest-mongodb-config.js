module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      ip: '0.0.0.0',
      // debug: true,
      dbName: 'test'
    },
    binary: {
      version: '4.0.3',
      skipMD5: true,
      platform: 'linux',
      arch: 'x64'
      // debug: true
    },
    autoStart: false
    // debug: true
  }
}
