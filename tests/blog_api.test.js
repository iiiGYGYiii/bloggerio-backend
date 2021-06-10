const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const api = supertest(app);
const helper = require("./test_helper");
const bcrypt = require("bcrypt");

beforeEach(async()=>{
  await Blog.deleteMany({});
  await Promise.all(helper.initialBlogs.map(blog => new Blog(blog).save()));
  await User.deleteMany({});
  
  await Promise.all(helper.initialUsers
    .map(user=>{
      return {
        username:user.username,
        passwordHash: bcrypt.hashSync(user.password,10)
      };
    })
    .map(user => new User(user).save()));
});

describe("related to users", () =>{
  test("all users are returned", async() =>{
    const response = await api.get("/api/users");
    expect(response.body).toHaveLength(helper.initialUsers.length);
  });

  test("users are returned as JSON", async()=>{
    await api.get("/api/users").expect(200).expect("Content-Type", /application\/json/);
  });

  describe("adding a new user to database", () =>{
    const newUser = {username: "Tester", password:"sekretTest"};
    test("success with status 200 and returns json", async()=>{
      await api.post("/api/users").send(newUser).expect(200).expect("Content-Type", /application\/json/);
      const response = await api.get("/api/users");
      expect(response.body).toHaveLength(helper.initialUsers.length+1);
      expect(response.body.map(user => user.username)).toContain("Tester");
    });

    test("creation of user returns id, username and empty blog array.", async() =>{
      let response = await api.post("/api/users").send(newUser);
      response=JSON.parse(response.text);
      expect(response.id).toBeDefined();
      expect(response.username).toBeDefined();
      expect(response.blogs).toBeDefined();
      expect(response.blogs).toHaveLength(0);
    });

    test("bad request returns 400", async()=>{
      await api.post("/api/users").send({username:"x", password:"efefef"}).expect(400);
    });

    test("existing username returns 400", async()=>{
      await api.post("/api/users").send({username:"iiiGYGYiii", password:"supersekret"}).expect(400);
    });
  });


});

describe("related to login", () =>{
  test("a token is created when user login", async() =>{
    const userToLogIn = {
      username:"iiiGYGYiii",
      password: "sekret"
    };
    await api.post("/api/login").send(userToLogIn).expect(200);
    const response = await api.post("/api/login").send(userToLogIn);
    expect(response.body.token).toBeDefined();
  });

  test("fails with 401 when data is invalid", async()=>{
    const userToLogIn = {
      username: "iiiGYGYiii",
      password: "secreto"
    };
    await api.post("/api/login").send(userToLogIn).expect(401);
  });
});

describe("related to blogs", () =>{
  test("all blogs are returned", async()=>{
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("blogs are returned as JSON", async()=>{
    await api.get("/api/blogs").expect(200).expect("Content-Type", /application\/json/);
  });

  describe("when creating a blog", ()=>{
    test("successful when user is logged", async()=>{
      const userToLogIn = {
        username:"iiiGYGYiii",
        password:"sekret"
      };
      const response = await api.post("/api/login").send(userToLogIn);
      const token = "bearer " + response.body.token;
      const blogToAdd = {
        title: "Testing the likes prop.",
        author: "Me",
        "url": "midu.dev"
      };
      await api.post("/api/blogs")
        .set("Authorization", token)
        .send(blogToAdd)
        .expect(200)
        .expect("Content-Type", /application\/json/);
      
      const ans = await api.get("/api/blogs");
      expect(ans.body).toHaveLength(helper.initialBlogs.length+1);
    });

    test("fails with error 400 if data is invalid", async () =>{
      const userToLogIn = {
        username:"iiiGYGYiii",
        password:"sekret"
      };
      const response = await api.post("/api/login").send(userToLogIn);
      const token = "bearer " + response.body.token;
      const badBlog = {
        author: "Me",
        likes: 123
      };
      await api.post("/api/blogs")
        .set("Authorization", token)
        .send(badBlog)
        .expect(400);

      const blogs = await api.get("/api/blogs");
      expect(blogs.body).toHaveLength(helper.initialBlogs.length);
    });

    test("succeeds with valid data", async() =>{
      const userToLogIn = {
        username:"iiiGYGYiii",
        password:"sekret"
      };
      const response = await api.post("/api/login").send(userToLogIn);
      const token = "bearer " + response.body.token;
      const blogToAdd = {
        title: "Testing the HTTP POST",
        author: "Me",
        url: "idk.idc/idgaf"
      };
    
      await api
        .post("/api/blogs")
        .set("Authorization", token)
        .send(blogToAdd)
        .expect(200)
        .expect("Content-Type", /application\/json/);
      
      const blogs = await api.get("/api/blogs");
      expect(blogs.body).toHaveLength(helper.initialBlogs.length+1);
    });

    test("failures with 401 when token is bad", async() =>{
      const token = "bearer thistokenisbad";
      const blogToAdd = {
        title: "The token is bad",
        author: "Me",
        url: "bad.tok.en"
      };
      await api.post("/api/blogs")
        .set("Authorization", token)
        .send(blogToAdd)
        .expect(401);
    });

    test("failures with 401 when user is not logged", async() =>{
      const token = "";
      const blogToAdd = {
        title: "The token is bad",
        author: "Me",
        url: "bad.tok.en"
      };
      await api.post("/api/blogs")
        .set("Authorization", token)
        .send(blogToAdd)
        .expect(401);

      const response = await api.post("/api/blogs")
        .set("Authorization", token)
        .send(blogToAdd);
      expect(response.body).toEqual({error: "must be logged to create blog"});
    });
  });

  describe("when deleting a blog", () =>{
    test("blogs collections are modified when succeeds", async () =>{
      const userToLogIn = {
        username:"iiiGYGYiii",
        password:"sekret"
      };
      const response = await api.post("/api/login").send(userToLogIn);
      const token = "bearer " + response.body.token;
      const blogCreated = await api.post("/api/blogs/")
        .set("Authorization", token)
        .send({
          title: "Testing the likes prop.",
          author: "Me",
          "url": "midu.dev"
        });
      await api.delete("/api/blogs/"+blogCreated.body.id)
        .set("Authorization", token)
        .expect(204);
      const afterBlogs = await api.get("/api/blogs");
      expect(afterBlogs.body).toHaveLength(helper.initialBlogs.length);
    });

    test("if no authorization, blogs collections stay same", async () =>{
      const userToLogIn = {
        username:"iiiGYGYiii",
        password:"sekret"
      };
      const response = await api.post("/api/login").send(userToLogIn);
      const token = "bearer " + response.body.token;
      const blogCreated = await api.post("/api/blogs/")
        .set("Authorization", token)
        .send({
          title: "Testing the likes prop.",
          author: "Me",
          "url": "midu.dev"
        });
      const afterBlogs = await api.get("/api/blogs");
      await api.delete("/api/blogs/"+blogCreated.body.id)
        .set("Authorization", "bearer faketoken")
        .expect(204);
      
      expect(afterBlogs.body).toHaveLength(helper.initialBlogs.length+1);
    });
  });

});

afterAll(() =>{
  mongoose.connection.close();
});
