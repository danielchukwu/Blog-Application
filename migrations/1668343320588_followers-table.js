/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
   pgm.sql(`
      CREATE TABLE followers (
         id SERIAL PRIMARY KEY,
         follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
         leader_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
         UNIQUE(follower_id, leader_id)
      )
   `)
};

exports.down = pgm => {
   pgm.sql(`
      DROP TABLE followers;
   `)
};
