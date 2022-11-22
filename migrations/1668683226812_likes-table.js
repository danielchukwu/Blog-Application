/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
   pgm.sql(`
      CREATE TABLE likes (
         id SERIAL PRIMARY KEY,
         user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
         blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
         comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
         is_like BOOLEAN,

         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
         UNIQUE(user_id, blog_id, comment_id),
         CHECK( COALESCE(blog_id::BOOLEAN::INTEGER, 0) + COALESCE((comment_id)::BOOLEAN::INTEGER, 0) = 1 )
      )
   `)
};

exports.down = pgm => {
   pgm.sql(`
      DROP TABLE likes;
   `)
};
