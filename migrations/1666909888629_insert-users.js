/* eslint-disable camelcase */

exports.shorthands = undefined;

// me, 1, 2
profile_pictures = [
   "https://raw.githubusercontent.com/danielchukwu/Blog-Application/master/APPS/Flask%20%26%20Jinja/posts/profile-images/me.jpg",
   "https://raw.githubusercontent.com/danielchukwu/Blog-Application/master/APPS/Flask%20%26%20Jinja/posts/profile-images/p-0.jpg",
   "https://raw.githubusercontent.com/danielchukwu/Blog-Application/master/APPS/Flask%20%26%20Jinja/posts/profile-images/p-1.jpg",
]

website = 'https://chukwudaniel.netlify.app/';
linkedin = 'https://www.linkedin.com/in/daniel-chukwu-738673221/'
facebook = 'https://web.facebook.com/profile.php?id=100086796198989'
twitter = 'https://twitter.com/daniellchukwu'
instagram = 'https://www.instagram.com/danielllchukwu/'


exports.up = pgm => {
   pgm.sql(`
      INSERT INTO users (name, username, email, avatar, bio, location, password, website, linkedin, facebook, twitter, instagram)
      VALUES 
         ('Chukwu Daniel', 'danielchukwu_', '00chukwudaniel@gmail.com', '${profile_pictures[0]}', 'jeremiah 9:23-34', 'kubwa, Abuja', 'password123', '${website}', '${linkedin}', '${facebook}', '${twitter}', '${instagram}'),

         ('Micheal Scott', 'micheallo', '00danzy@gmail.com', '${profile_pictures[1]}', 'Live is good. Never been better.', 'colorado, United States', 'password123', '${website}', '${linkedin}', '${facebook}', '${twitter}', '${instagram}'),

         ('john winter', 'johnny_boy', 'daniellchukw@yahoo.com', '${profile_pictures[2]}', 'Just a simple guy', 'colorado, United States', 'password123', '${website}', '${linkedin}', '${facebook}', '${twitter}', '${instagram}');
   `)
};

exports.down = pgm => {
   pgm.sql(`
      DELETE FROM users;
   `)
};
