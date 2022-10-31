/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
   pgm.sql(`
      CREATE TABLE companies (
         id SERIAL PRIMARY KEY,
         title varchar(50) UNIQUE
      );

      CREATE TABLE companies_users (
         id SERIAL PRIMARY KEY,
         company_id INTEGER NOT NULL,
         user_id INTEGER NOT NULL UNIQUE,
         
         UNIQUE(company_id, user_id)
      );
   `)
};

exports.down = pgm => {
   pgm.sql(`
      DROP TABLE companies;
      DROP TABLE companies_users;
   `)
};
