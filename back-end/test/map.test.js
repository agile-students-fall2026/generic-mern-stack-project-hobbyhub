import { expect } from "chai"
import request from "supertest"
import app from "../app.js"

describe("Map API", () => {
  it("should return all events", async () => {
    const res = await request(app).get("/api/events")

    expect(res.status).to.equal(200)
    expect(res.body).to.be.an("array")
    expect(res.body).to.have.length.greaterThan(0)
  })

  it("should return events with map information", async () => {
    const res = await request(app).get("/api/events")

    res.body.forEach((event) => {
      expect(event).to.have.property("id")
      expect(event).to.have.property("title")
      expect(event).to.have.property("location")
      expect(event).to.have.property("time")
      expect(event).to.have.property("hobby")
    })
  })
})