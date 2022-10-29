/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
   pgm.sql(`
      CREATE TABLE users (
         id SERIAL PRIMARY KEY,
         name VARCHAR(50) NOT NULL,
         username VARCHAR(50) NOT NULL UNIQUE,
         email VARCHAR(50) NOT NULL UNIQUE,
         avatar VARCHAR(200),
         cover VARCHAR(200),
         bio VARCHAR(300),
         location VARCHAR(50),

         website VARCHAR(200),
         linkedin VARCHAR(200),
         facebook VARCHAR(200),
         twitter VARCHAR(200),
         instagram VARCHAR(200),
         youtube VARCHAR(200),
         
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
   `)
};

exports.down = pgm => {
   pgm.sql(`
      DROP TABLE users;
   `)
};
