/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
   pgm.sql(`
      CREATE TABLE skills (
         id SERIAL PRIMARY KEY,
         title varchar(50) UNIQUE
      );

      CREATE TABLE skills_users (
         id SERIAL PRIMARY KEY,
         skill_id INTEGER NOT NULL,
         user_id INTEGER NOT NULL UNIQUE,
         
         UNIQUE(skill_id, user_id)
      );
   `)
};

exports.down = pgm => {
   pgm.sql(`
      DROP TABLE skills;
      DROP TABLE skills_users;
   `)
};
