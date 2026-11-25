import { expect } from "chai"
import request from "supertest"
import app from "../app.js"

describe("Authentication API", () => {
  const testUser = {
    name: "Test User",
    email: "auth-test@example.com",
    password: "test12345",
  }

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser)

    expect(res.status).to.equal(201)
    expect(res.body.message).to.equal("Account created successfully")
    expect(res.body.user.email).to.equal(testUser.email)
    expect(res.body.user).to.not.have.property("password")
  })

  it("should reject duplicate emails", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser)

    expect(res.status).to.equal(409)
    expect(res.body.error).to.equal(
      "An account with this email already exists"
    )
  })

  it("should reject registration with missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test User", email: "" })

    expect(res.status).to.equal(400)
    expect(res.body).to.have.property("error")
  })

  it("should reject passwords shorter than 8 characters", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Another User",
        email: "another@example.com",
        password: "123",
      })

    expect(res.status).to.equal(400)
    expect(res.body.error).to.equal(
      "Password must be at least 8 characters long"
    )
  })

  it("should log in with valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      })

    expect(res.status).to.equal(200)
    expect(res.body.message).to.equal("Login successful")
    expect(res.body.user.email).to.equal(testUser.email)
    expect(res.body.user).to.not.have.property("password")
  })

  it("should reject an incorrect password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: "wrongpassword",
      })

    expect(res.status).to.equal(401)
    expect(res.body.error).to.equal("Invalid email or password")
  })

  it("should reject login with missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email })

    expect(res.status).to.equal(400)
    expect(res.body).to.have.property("error")
  })
})
