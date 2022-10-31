from ast import arg
from flask import Flask, render_template, request, redirect, url_for, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import psycopg2
import os
from functools import wraps
import jwt
import datetime

from utils import is_valid_password
import info


# Manage dabatabase related tasks
class DbManager:

   def __init__(self) -> None:
      self.conn = psycopg2.connect(
                     host="localhost",
                     port="5432",
                     database="lets-blog",
                     user=os.getenv("user"),
                     password=os.getenv("password")
                  )
      self.cur = self.conn.cursor()


   def get_blogs(self):
      self.cur.execute("""
         SELECT b.id, b.title, content, img, user_id, c.title
         FROM blogs as b
         JOIN categories_blogs as cb ON b.id = cb.blog_id
         JOIN categories as c on c.id = cb.category_id
      """)
      blogs_row = self.cur.fetchall()
      keys = ["id", "title", "content", "img", "user_id", "category"]
      blogs = [ { keys[i]:v for i,v in enumerate(row) } for row in blogs_row]
      
      return blogs


   def get_user_blogs(self, id):
      self.cur.execute("""
         SELECT b.id, b.title, content, img, user_id, c.title
         FROM blogs as b
         JOIN categories_blogs as cb ON b.id = cb.blog_id
         JOIN categories as c on c.id = cb.category_id
         WHERE b.user_id = %s
      """, (id,))
      blogs_row = self.cur.fetchall()
      keys = ["id", "title", "content", "img", "user_id", "category"]
      blogs = [ { keys[i]:v for i,v in enumerate(row) } for row in blogs_row]
      
      return blogs


   def get_blog(self, id):
      self.cur.execute("""
         SELECT b.id, b.title, content, img, user_id, c.title, u.username, u.avatar, u.name, u.location, u.bio
         FROM blogs as b
         JOIN categories_blogs as cb ON b.id = cb.blog_id
         JOIN categories as c ON c.id = cb.category_id
         JOIN users as u ON b.user_id = u.id
         where b.id = %s;
      """, (id,))
      blog_row = self.cur.fetchone()
      keys = ["id", "title", "content", "img", "user_id", "category", "username", "avatar", "name", "location", "bio"]
      blog = { keys[i]:v for i,v in enumerate(blog_row) }

      return blog


   def get_user(self, id):
      self.cur.execute("""
         SELECT id, name, username, email, avatar, cover, bio, location, website, linkedin, facebook, twitter, instagram, youtube, created_at, updated_at 
         FROM users WHERE id = %s
      """, (id,))
      user_row = self.cur.fetchone()
      keys = ["id", "name", "username", "email", "avatar", "cover", "bio", "location", "website", "linkedin", "facebook", "twitter", "instagram", "youtube", "created_at", "updated_at"]
      user = { keys[i]:v for i,v in enumerate(user_row) }
      user["skills"] = self.get_skills(id)
      user["occupation"] = self.get_occupation(id)
      user["company"] = self.get_company(id)
      # print(user)

      return user   


   def get_skills(self, id):
      self.cur.execute("""
         SELECT title
         FROM skills_users
         JOIN skills ON skills.id = skill_id
         WHERE user_id = %s;
      """, (id,))
      skills_rows = self.cur.fetchall()
      skills = [value[0] for value in skills_rows]
      return skills


   def get_occupation(self, id):
      self.cur.execute("""
         SELECT occupations.title
         FROM occupations_users
         JOIN occupations ON occupation_id = occupations.id
         WHERE user_id = %s
      """, (id,))
      occupation = self.cur.fetchone()[0]
      return occupation


   def get_company(self, id):
      self.cur.execute("""
         SELECT companies.title
         FROM companies_users
         JOIN companies ON company_id = companies.id
         WHERE user_id = %s
      """, (id,))
      company = self.cur.fetchone()[0]
      return company


   def close_cur_conn(self):
      self.cur.close()
      self.conn.close()
      

# Authenticate User
class UserManager:

   def __init__(self, cur, request) -> None:
      self.cur = cur
      self.request = request

   
   # Login
   def login(self, **kwargs) -> tuple :
      """
      Returns a user Object if the forms username and password is valid
      """
      username, password = kwargs['username'].strip(), kwargs['password'].strip()
      self.cur.execute('SELECT id, username, password FROM users WHERE username = %s', (username,))
      user = self.cur.fetchone()

      if user:
         is_valid = check_password_hash(user[2], password=password)
         if is_valid: # TODO: Authenticate user
            print("login user...")
            return user
      return None


   # Registration
   def register(self) -> tuple():
      """
      Returns a tuple containing 2 items. 
      1st: is to be either a user object or a None value if registration was unsuccessful.
      2nd: is to be either a list of invalid fields or an empty list with no invalid field found. 
      """

      # Credentials
      username   = self.request.form['username'].lower()
      name       = self.request.form['name'].lower()
      email      = self.request.form['email']
      occupation = self.request.form['occupation'].title()
      company    = self.request.form['company'].title()
      password   = self.request.form['password']

      invalid_fields = []
      
      # Check Username
      self.cur.execute('SELECT * FROM users WHERE username = %s', (username,))
      if self.cur.fetchone():
         invalid_fields.append("username")

      # Check Email
      self.cur.execute('SELECT * FROM users WHERE email = %s', (email,))
      if self.cur.fetchone():
         invalid_fields.append("email")

      # Check Password
      is_valid_password(password, invalid_fields)

      # Hash Password
      password = generate_password_hash(password)

      print(invalid_fields)
      if len(invalid_fields) == 0:
         # Form is valid
         user = self.create_user(self, username, name, email, occupation, company, password)
         return (user, invalid_fields)
      else:
         # Form is not valid
         return (None, invalid_fields)


   # for register_user
   def create_user(self, username, name, email, occupation_title, company_title, password):
      self.cur.execute("""
         BEGIN;

         INSERT INTO users (username, name, email, password)
         VALUES (%s, %s, %s, %s);

         COMMIT;
      """, (username, name, email, password))
      self.cur.execute('SELECT * FROM users WHERE username = %s;', (username,))
      user = self.cur.fetchone()
      user_id = user[0]
      
      # Add Occupation
      self.add_occupation(self, user_id, occupation_title)

      # Add Company
      self.add_company(self, user_id, company_title)

      return user


   # for create_user
   def add_occupation(self, user_id, occupation_title):
      try:
         # Get Occupation
         self.cur.execute('SELECT * FROM occupations WHERE title = %s', (occupation_title,))
         occupation = self.cur.fetchone()
         occupation_id = occupation[0]
      except:
         # Create Occupation
         self.cur.execute("""
            BEGIN;
         
            INSERT INTO occupations (title)
            VALUES (%s);

            COMMIT;
         """, (occupation_title,))
         # Get occupation
         self.cur.execute('SELECT * FROM occupations WHERE title = %s', (occupation_title,))
         occupation = self.cur.fetchone()
         occupation_id = occupation[0]

      # Create Relationship
      self.cur.execute("""
         BEGIN;

         INSERT INTO occupations_users (occupation_id, user_id)
         VALUES (%s, %s);

         COMMIT;
      """, (occupation_id, user_id))


   # for add_company
   def add_company(self, user_id, company_title):
      try:
         # Get company
         self.cur.execute('SELECT * FROM companies WHERE title = %s', (company_title,))
         company = self.cur.fetchone()
         company_id = company[0]
      except:
         # Create company
         self.cur.execute("""
            BEGIN;
         
            INSERT INTO companies (title)
            VALUES (%s);

            COMMIT;
         """, (company_title,))
         # Get company
         self.cur.execute('SELECT * FROM companies WHERE title = %s', (company_title,))
         company = self.cur.fetchone()
         company_id = company[0]

      self.cur.execute("""
         BEGIN;

         INSERT INTO companies_users (company_id, user_id)
         VALUES (%s, %s);

         COMMIT;
      """, (company_id, user_id))



def token_required(f):
   @wraps(f)
   def decorator(*args, **kwargs):
      token = None
      if 'x-access-tokens' in request.headers:
         token = request.headers['x-access-tokens']

      if not token:
         return jsonify({'message': 'a valid token is missing'})
      try:
         data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
         db = DbManager()
         current_user = db.get_user(args[0])
      except:
         return jsonify({'message': 'token is invalid'})

      return f(current_user, *args, **kwargs)
   return decorator


   

# Create flask app
app = Flask(__name__)



# Routes
@app.route("/")
@token_required
def index():
   db = DbManager()
   blogs = db.get_blogs()
   db.close_cur_conn()

   context = {"blogs": blogs}
   return render_template("index.html", context=context)


@app.route("/blogs/<id>")
def blog(id):
   db = DbManager()
   blog = db.get_blog(id)
   db.close_cur_conn()

   context = {"blog": blog}
   return render_template("blog.html", context=context)


@app.route("/users/<id>")
def profile(id):
   db = DbManager()
   user = db.get_user(id)
   blogs = db.get_user_blogs(id)
   db.close_cur_conn()

   context = {"user": user, "blogs": blogs}
   return render_template("profile.html", context=context)


@app.route("/login/", methods=["GET", "POST"])
def login():
   if request.method == "GET":
      return render_template("login.html")
   else:
      db = DbManager()
      username, password = request.form['username'], request.form['password']
      manager = UserManager(db.cur, request)
      user = manager.login(username=username, password=password)
      db.close_cur_conn()

      if user:
         token = jwt.encode({'user_id' : user.public_id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=45)}, app.config['SECRET_KEY'], "HS256")

         return jsonify({'token' : token})
      else:
         return render_template("login.html", context={"message": "invalid username or password", "username": request.form['username']})


@app.route("/sign-up/", methods=["GET", "POST"])
def sign_up():
   if request.method == "GET":
      return render_template("sign-up.html")
   else:
      db = DbManager()
      manager = UserManager(db.cur, request)
      manager.register()
      db.close_cur_conn()
      return render_template("sign-up.html")


if __name__ == "__main__":
   app.run(debug=True)

