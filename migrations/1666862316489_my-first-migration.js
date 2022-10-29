/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
   pgm.sql(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   `)
};

exports.down = pgm => {
   pgm.sql(`
      DROP EXTENSION IF EXISTS "uuid-ossp";
   `)
};
