/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
   pgm.sql(`
      CREATE TABLE blogs (
         id SERIAL PRIMARY KEY,
         title VARCHAR(150) NOT NULL,
         content VARCHAR(1000) NOT NULL,
         img VARCHAR(200) NOT NULL,
         user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,

         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
   `)
};

exports.down = pgm => {
   pgm.sql(`
      DROP TABLE blogs;
   `)
};
