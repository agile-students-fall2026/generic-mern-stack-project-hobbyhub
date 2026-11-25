import { expect } from "chai"
import request from "supertest"
import app from "../app.js"

describe("Feed tests", () => {

  it("should return a successful response", async () => {
    const response = await request(app).get("/api/posts")
    expect(response.status).to.equal(200)
  })

  it("should return an array of posts", async () => {
    const response = await request(app).get("/api/posts")
    expect(response.body).to.be.an("array")
    expect(response.body.length).to.be.greaterThan(0)
  })

  it("should return posts with a username and caption", async () => {
    const response = await request(app).get("/api/posts")
    expect(response.body[0]).to.have.property("username")
    expect(response.body[0]).to.have.property("caption")
  })

})

describe("Following tests", () => {

  it("should return a successful response", async () => {
    const response = await request(app).get("/api/following")
    expect(response.status).to.equal(200)
  })

  it("should return following posts", async () => {
    const response = await request(app).get("/api/following")
    expect(response.body.posts).to.be.an("array")
  })

  it("should return creator updates", async () => {
    const response = await request(app).get("/api/following")
    expect(response.body.updates).to.be.an("array")
  })

})

describe("Create Post tests", () => {

  it("should successfully create a post", async () => {
    const response = await request(app)
      .post("/api/posts")
      .send({
        username: "testuser",
        caption: "Testing a new post",
        image: ""
      })

    expect(response.status).to.equal(201)
  })

  it("should return the submitted post information", async () => {
    const response = await request(app)
      .post("/api/posts")
      .send({
        username: "testuser",
        caption: "Testing pottery",
        image: ""
      })

    expect(response.body.username).to.equal("testuser")
    expect(response.body.caption).to.equal("Testing pottery")
    expect(response.body).to.have.property("id")
  })

})
