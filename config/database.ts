/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import Application from '@ioc:Adonis/Core/Application'
import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'

const databaseConfig: DatabaseConfig = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | The primary connection for making database queries across the application
  | You can use any key from the `connections` object defined in this same
  | file.
  |
  */
  connection: Env.get('DB_CONNECTION', 'sqlite'),

  connections: {
    /*
    |--------------------------------------------------------------------------
    | Sqlite
    |--------------------------------------------------------------------------
    |
    | Configuration for the Sqlite database.  Make sure to install the driver
    | from npm when using this connection
    |
    | npm i sqlite3
    |
    */
    sqlite: {
      client: 'sqlite',
      connection: {
        filename: Application.tmpPath('db.sqlite3'),
      },
      migrations: {
        naturalSort: true,
      },
      useNullAsDefault: true,
      healthCheck: false,
      debug: false,
    },

    /*
    |--------------------------------------------------------------------------
    | Mysql config
    |--------------------------------------------------------------------------
    |
    | Configuration for Mysql database. Make sure to install the driver
    | from npm when using this connection
    |
    | npm i mysql
    |
    */
    mysql: {
      client: 'mysql',
      connection: {
        host: Env.get('DB_HOST', '127.0.0.1') as string,
        port: Number(Env.get('DB_PORT', 3306)),
        user: Env.get('DB_USER', 'lucid') as string,
        password: Env.get('DB_PASSWORD', 'lucid') as string,
        database: Env.get('DB_NAME', 'lucid') as string,
      },
      migrations: {
        naturalSort: true,
      },
      healthCheck: false,
      debug: false,
    },

    /*
    |--------------------------------------------------------------------------
    | PostgreSQL config
    |--------------------------------------------------------------------------
    |
    | Configuration for PostgreSQL database. Make sure to install the driver
    | from npm when using this connection
    |
    | npm i pg
    |
    */
    pg: {
      client: 'pg',
      connection: {
        host: Env.get('DB_HOST', '127.0.0.1') as string,
        port: Number(Env.get('DB_PORT', 5432)),
        user: Env.get('DB_USER', 'lucid') as string,
        password: Env.get('DB_PASSWORD', 'lucid') as string,
        database: Env.get('DB_NAME', 'lucid') as string,
      },
      migrations: {
        naturalSort: true,
      },
      healthCheck: false,
      debug: false,
    },
  },
}

export default databaseConfig
