const router = require("../routes/index");
const express = require("express");
const request = require("supertest");
const mongoose = require("../config/mongoConfigTest");
const { describe } = require("node:test");
const user = require("../models/user");
const passport = require("passport");
require("../config/passport")(passport);

const app = express();

beforeAll(async () => {
  await mongoose();
  await user.create({
    username: "test",
    hash: "24b1b609c7a8982dd924c6b2c4e2a2694efbc8f6dff6136cc14ee37e95933189513822ffe683cc5309c9a01b2a5423864771ff8c061cf1687e123cb39472bd6e",
    salt: "5021daaaf62505b024b1b6439ff3add2365d453a6bab12b8cbf8c2d8253f1719",
    email: "test@example.com",
    _id: "663274a84ed2d052a6b8eda1",
  });
});

afterAll(async () => {
  await user.deleteMany({});
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);
app.use(passport.initialize());

describe("User registration", () => {
  test("should return error for invalid email", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        username: "testuser",
        password: "testpassword",
        email: "invalidemail",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(response.body.success).toBe(false);
    // response.body.msg is an object inside an array returned by Express validator middleware
    expect(response.body.msg[0].msg).toContain(
      "Please provide a valid email address"
    );
  });

  test("should register user and return access token", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        username: "testuser",
        password: "testpassword",
        email: "test@gmail.com",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.expiresIn).toBeDefined();
  });
});

describe("User login", () => {
  test("Log ins user and provides access and refresh token", async () => {
    const response = await request(app)
      .post("/users/login")
      .set("Accept", "application/json")
      .expect("Content-Type", "application/json; charset=utf-8")
      .send({ username: "test", password: "123" })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
  });
  test("User does not exist after trying to log in", async () => {
    const response = await request(app)
      .post("/users/login")
      .set("Accept", "application/json")
      .expect("Content-Type", "application/json; charset=utf-8")
      .send({ username: "testUser1", password: "123" })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe("could not find user");
  });
  test("Logins with invalid credentials", async () => {
    const response = await request(app)
      .post("/users/login")
      .set("Accept", "application/json")
      .expect("Content-Type", "application/json; charset=utf-8")
      .send({ username: "test", password: "12" })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe("you entered the wrong password");
  });
});

describe("Authorized route", () => {
  test("Logs in and can visit authorized routes", async () => {
    const loginResponse = await request(app)
      .post("/users/login")
      .set("Accept", "application/json")
      .expect("Content-Type", "application/json; charset=utf-8")
      .send({ username: "test", password: "123" })
      .expect(200);

    const accessToken = loginResponse.body.token;
    const protectedResponse = await request(app)
      .get("/users/protected")
      .set("Authorization", accessToken)
      .expect(200);

    expect(protectedResponse.body.success).toBe(true);
    expect(protectedResponse.body.msg).toBe("You are authorized");
  });
});

describe("refresh Token", () => {
  test("should provide a new access token based on a refresh token. Will login in first to generate token"
  ,async () => {
    const response = await request(app)
      .post("/users/login")
      .set("Accept", "application/json")
      .expect("Content-Type", "application/json; charset=utf-8")
      .send({ username: "test", password: "123" })
      .expect(200);

    const token = response.body.refreshToken;
    const refreshTokenResponse = await request(app)
      .post("/users/refresh")
      .set("Accept", "application/json")
      .send({ refresh: token })
      .expect(200);

    expect(refreshTokenResponse.body.success).toBe(true);
    expect(refreshTokenResponse.body.token).toBeDefined();
  });
  test("Should reject an invalid refresh token. Will login in first to generate token", async () => {
    const response = await request(app)
      .post("/users/login")
      .set("Accept", "application/json")
      .expect("Content-Type", "application/json; charset=utf-8")
      .send({ username: "test", password: "123" })
      .expect(200);

    const token = "Not a valid token";
    const refreshTokenResponse = await request(app)
      .post("/users/refresh")
      .set("Accept", "application/json")
      .send({ refresh: token })
      .expect(403);

    expect(refreshTokenResponse.body.success).toBe(false);
    expect(refreshTokenResponse.body.msg).toBe("Invalid refresh token");
  });
});
