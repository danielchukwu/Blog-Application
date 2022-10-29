/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
   pgm.sql(`
      CREATE TABLE occupations (
         id SERIAL PRIMARY KEY,
         title varchar(50) UNIQUE
      );

      CREATE TABLE occupations_users (
         id SERIAL PRIMARY KEY,
         occupation_id INTEGER NOT NULL,
         user_id INTEGER NOT NULL,
         
         UNIQUE(occupation_id, user_id)
      );
   `)
};

exports.down = pgm => {
   pgm.sql(`
      DROP TABLE occupations;
      DROP TABLE occupations_users;
   `)
};
