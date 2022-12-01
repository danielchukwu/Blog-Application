/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
   pgm.sql(`
      CREATE TABLE notifications (
         id SERIAL PRIMARY KEY,
         leader_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
         junior_id INTEGER NOT NULL,
         senior_id INTEGER,
         group_id VARCHAR(36),
         seen BOOLEAN,
         type VARCHAR(20),

         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

         UNIQUE(type, leader_id, junior_id, senior_id)
      )
   `)
};

exports.down = pgm => {
   pgm.sql(`
      DROP TABLE notifications;
   `)
};
