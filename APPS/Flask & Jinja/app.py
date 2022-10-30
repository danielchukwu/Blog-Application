from flask import Flask, render_template, request
import psycopg2
import os
import info



# Create connection and cursor
def create_connection():
   conn = psycopg2.connect(
      host="localhost",
      port="5432",
      database="lets-blog",
      user=os.getenv("user"),
      password=os.getenv("password")
   )
   return conn


def get_blogs(cur):
   cur.execute("""
      SELECT b.id, b.title, content, img, user_id, c.title
      FROM blogs as b
      JOIN categories_blogs as cb ON b.id = cb.blog_id
      JOIN categories as c on c.id = cb.category_id
   """)
   blogs_row = cur.fetchall()
   keys = ["id", "title", "content", "img", "user_id", "category"]
   blogs = [ { keys[i]:v for i,v in enumerate(row) } for row in blogs_row]
   
   return blogs


def get_user_blogs(cur, id):
   cur.execute("""
      SELECT b.id, b.title, content, img, user_id, c.title
      FROM blogs as b
      JOIN categories_blogs as cb ON b.id = cb.blog_id
      JOIN categories as c on c.id = cb.category_id
      WHERE b.user_id = %s
   """, (id))
   blogs_row = cur.fetchall()
   keys = ["id", "title", "content", "img", "user_id", "category"]
   blogs = [ { keys[i]:v for i,v in enumerate(row) } for row in blogs_row]
   
   return blogs


def get_blog(cur, id):
   print(f"ID: {id}")
   cur.execute("""
      SELECT b.id, b.title, content, img, user_id, c.title, u.username, u.avatar, u.name, u.location, u.bio
      FROM blogs as b
      JOIN categories_blogs as cb ON b.id = cb.blog_id
      JOIN categories as c ON c.id = cb.category_id
      JOIN users as u ON b.user_id = u.id
      where b.id = %s;
   """, (id))
   blog_row = cur.fetchone()
   keys = ["id", "title", "content", "img", "user_id", "category", "username", "avatar", "name", "location", "bio"]
   blog = { keys[i]:v for i,v in enumerate(blog_row) }

   return blog


def get_user(cur, id):
   cur.execute("""
      SELECT * FROM users WHERE id = %s
   """, (id))
   user_row = cur.fetchone()
   keys = ["id", "name", "username", "email", "avatar", "cover", "bio", "location", "website", "linkedin", "facebook", "twitter", "instagram", "youtube", "created_at", "updated_at"]
   user = { keys[i]:v for i,v in enumerate(user_row) }
   user["skills"] = get_skills(cur, id)
   user["occupation"] = get_occupation(cur, id)
   user["company"] = get_company(cur, id)
   print(user)

   return user   


def get_skills(cur, id):
   cur.execute("""
      SELECT title
      FROM skills_users
      JOIN skills ON skills.id = skill_id
      WHERE user_id = %s;
   """, (id))
   skills_rows = cur.fetchall()
   skills = [value[0] for value in skills_rows]
   return skills


def get_occupation(cur, id):
   cur.execute("""
      SELECT occupations.title
      FROM occupations_users
      JOIN occupations ON occupation_id = occupations.id
      WHERE user_id = %s
   """, (id))
   occupation = cur.fetchone()[0]
   return occupation


def get_company(cur, id):
   cur.execute("""
      SELECT companies.title
      FROM companies_users
      JOIN companies ON company_id = companies.id
      WHERE user_id = %s
   """, (id))
   company = cur.fetchone()[0]
   return company


def close_cur_conn(cur, conn):
   cur.close()
   conn.close()



# Create flask app
app = Flask(__name__)


@app.route("/")
def index():
   conn = create_connection()
   cur = conn.cursor()
   blogs = get_blogs(cur)
   close_cur_conn(cur, conn)

   context = {"blogs": blogs}
   return render_template("index.html", context=context)


@app.route("/blogs/<id>")
def blog(id):
   conn = create_connection()
   cur = conn.cursor()
   blog = get_blog(cur, id)
   close_cur_conn(cur, conn)
   print(blog)

   context = {"blog": blog}
   return render_template("blog.html", context=context)


@app.route("/users/<id>")
def profile(id):
   conn = create_connection()
   cur = conn.cursor()
   user = get_user(cur, id)
   blogs = get_user_blogs(cur, id)
   print(blogs)
   close_cur_conn(cur, conn)

   context = {"user": user, "blogs": blogs}
   return render_template("profile.html", context=context)


@app.route("/login/", methods=["GET", "POST"])
def login():
   if request.method == "GET":
      return render_template("login.html")
   else:
      print(request.form['username'])
      print(request.form['password'])
      return render_template("login.html")
      


@app.route("/sign-up/", methods=["GET", "POST"])
def sign_up():
   if request.method == "GET":
      return render_template("sign-up.html")
   else:
      return render_template("sign-up.html")


if __name__ == "__main__":
   app.run(debug=True)

