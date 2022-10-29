/* eslint-disable camelcase */

exports.shorthands = undefined;


exports.up = pgm => {
   pgm.sql(`
      INSERT INTO skills (title)
      VALUES
         ('Python'),
         ('Javascript'),
         ('Java'),
         ('Go'),
         ('Php'),
         ('HTML'),
         ('CSS'),
         ('React'),
         ('Angular'),
         ('Flutter'),
         ('React Native'),
         ('SQL'),
         ('Flask'),
         ('Django'),
         ('Node JS'),
         ('Express'),
         ('Mongodb'),
         ('Automation'),
         ('Designer');

      INSERT INTO occupations (title)
      VALUES
         ('Electrical Engineer'),
         ('Doctor'),
         ('Nurse'),
         ('Business'),
         ('Architect'),
         ('Artist'),
         ('Accountant'),
         ('Athlete'),
         ('Software Engineer'),
         ('Backend Developer'),
         ('Frontend Developer'),
         ('Full-stack Developer'),
         ('Dev ops');


      INSERT INTO companies (title)
      VALUES
         ('Building Nations'),
         ('General Hospital'),
         ('NNPC'),
         ('CBN'),
         ('Edo fc'),
         ('Google'),
         ('Facebook'),
         ('Netflix');
   `)
};

exports.down = pgm => {
   pgm.sql(`
      DELETE FROM skills;
      DELETE FROM occupations;
      DELETE FROM companies;
   `)
};
