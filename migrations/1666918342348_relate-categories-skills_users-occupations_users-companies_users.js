/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
   pgm.sql(`

      INSERT INTO categories_blogs (category_id, blog_id)
      VALUES
         (1, 1), (1, 9), (2, 4), (2, 5), (2, 6), (2, 7), (3, 3), (4, 2), (5, 8), (6, 10);

      INSERT INTO skills_users (skill_id, user_id)
      VALUES
         (1, 1), (2, 1), (3, 1), (6, 1), (7, 1), (8, 1), (10, 1),
         (1, 2), (11, 2), (12, 2), (13, 2), (14, 2), (15, 2), (16, 2), (18, 2), 
         (1, 3), (18, 3), (19, 3);

      INSERT INTO companies_users (company_id, user_id)
      VALUES
         (8, 1), (3, 2), (2, 3);

      INSERT INTO occupations_users (occupation_id, user_id)
      VALUES
         (9, 1), (2, 2), (2, 3);
   `)
};

exports.down = pgm => {
   pgm.sql(`
      DELETE FROM categories_blogs;
      DELETE FROM skills_users;
      DELETE FROM companies_users;
      DELETE FROM occupations_users;
   `)
};
