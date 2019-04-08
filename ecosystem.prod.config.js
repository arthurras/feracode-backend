module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    {
      name      : 'API_Prod',
      script    : '/home/ubuntu/feracode/feracode-backends/server.js',
      //instances : 2,
      exec_mode : 'cluster',
      env: {
        COMMON_VARIABLE: 'true',
        NODE_ENV: 'prod',
        NODE_CONFIG_DIR: '/home/ubuntu/feracode/feracode-backends/config'
      },
      env_production : {
        NODE_ENV: 'prod'
      }
    }
  ],


};
