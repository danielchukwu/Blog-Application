/* eslint-disable camelcase */

exports.shorthands = undefined;

IMAGE_PATH = '../posts/blog-images'


// beach, coding, exercise, fifa-23, fifa-23, gta-6, nba, peter-obi, pool, ronaldo
blog_images = [
   "1._jensen-beach-martin-county-florida_emj7jb.jpg",
   "codingroom_lcbufk.jpg",
   "exercise_dffino.jpg",
   "fifa-23_labh83.webp",
   "fifa-23-1_zjsudl.webp",
   "gta_6_tdfews.webp",
   "nba_qktqvn.jpg",
   "Peter-Obi_xhvgep.jpg",
   "pool_xlonyp.jpg",
   "ronaldo_xy950g.jpg",
]

// beach, coding, exercise, fifa-23, fifa-23, gta-6, nba, peter-obi, pool, ronaldo
contents = [
   'It was looking really good up in san franciscos downtown beach. \nI absolutely enjoyed every second I spent there.',
   'Developers are seriously out here developing themselves like crazy. At some point it feels like they need me to advise them why they need to just chill out.',
   'See. When i say it is not easy to get in shape i aint just trying to seek attention, I mean that which i say most often. Lol. Get in shape.',
   'The celebrations i have been seeing from mbappe anytime he scores is just amazing to say the least.',
   'Leg over okpor!. I repeat leg over OKPOR!. I love what EA to the someplace... did with the leg movement in this years fifa 23. Its truly brilliant. Can I someday be an engineer at a company like that.',
   'Ive got great news guys. Rockstar has finally started the creation of gta 6. No doubt this games completion is nothing less than 10 years ahead of us, and yes i said that or wrote that. Which ever. Ps5 owners, yall might wanna start selling your consoles and saving up for Ps6 or something',
   'Some people say they ve never seen a Nigerian man that plays NBA 2K as well as a guy named daniel does. And i find that to be extremely accurate.',
   'Who said God does not answer prayers. Hit me up lets take care of business right now (090314204**). Cuz you is really not alright.',
   'This beach is one of the best things that has happened to this World. Waist no time if you are reading this to book the next flight to LA',
   'Ronaldo scores for the second time in the 2022/23 premier league season and the fans love it. And what they love even more than the amazing goal is an even better/more amazing celebration. This guy is truly the GOAT. Siiuuuuuuu.',
]

titles = [
   "One Of The Most Wonderful Place to be Right Now",
   "5 Reasons Why Coding Is Addictive",
   "Micheal B. Jordan Type Exercises Can Get You Right",
   "Fifa 23 - Celebrate Like Your Life Depends On It",
   "Skills Like Never Before",
   "Rockstarts GTA 6 has Officially Been Announced",
   "Nigerian NBA 2K GOAT",
   "The Choosen One",
   "LA",
   "A New Ronaldo Celebration Has The Internet Going Crazy",
]

exports.up = pgm => {
   pgm.sql(`
      INSERT INTO blogs (title, img, content, user_id)
      VALUES
         ('${titles[0]}', '${blog_images[0]}', '${contents[0]}', 1),
         ('${titles[1]}', '${blog_images[1]}', '${contents[1]}', 2),
         ('${titles[2]}', '${blog_images[2]}', '${contents[2]}', 3),
         ('${titles[3]}', '${blog_images[3]}', '${contents[3]}', 1),
         ('${titles[4]}', '${blog_images[4]}', '${contents[4]}', 1),
         ('${titles[5]}', '${blog_images[5]}', '${contents[5]}', 1),
         ('${titles[6]}', '${blog_images[6]}', '${contents[6]}', 1),
         ('${titles[7]}', '${blog_images[7]}', '${contents[7]}', 1),
         ('${titles[8]}', '${blog_images[8]}', '${contents[8]}', 3),
         ('${titles[9]}', '${blog_images[9]}', '${contents[9]}', 2);

      INSERT INTO categories (title)
      VALUES ('travel'),('games'),('fitness'),('coding'),('politics'),('sports');
   `)
};

exports.down = pgm => {
   pgm.sql(`
      DELETE FROM blogs;
      DELETE FROM categories;
   `)
};
