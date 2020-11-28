require('dotenv').config({path: './.env.dev'});

const [ user, host, database, password, client ] = [ process.env.user, process.env.host_knex, process.env.database, process.env.password, process.env.client ];

module.exports = {
  development: {
    client: client || 'pg',
    connection: {
      host : host || '127.0.0.1',
      user : user || 'postgres',
      password : password || 'password',
      database : database || 'db',
    }
  },
};
