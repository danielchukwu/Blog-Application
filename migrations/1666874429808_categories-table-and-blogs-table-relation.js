/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
   pgm.sql(`
      CREATE TABLE categories (
         id SERIAL PRIMARY KEY,
         title varchar(50) UNIQUE
      );

      CREATE TABLE categories_blogs (
         id SERIAL PRIMARY KEY,
         category_id INTEGER NOT NULL,
         blog_id INTEGER NOT NULL,
         
         UNIQUE(category_id, blog_id)
      );
   `)
};

exports.down = pgm => {
   pgm.sql(`
      DROP TABLE categories;
      DROP TABLE categories_blogs;
   `)
};