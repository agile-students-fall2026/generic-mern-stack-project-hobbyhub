import express from "express"
import events from "../data/events.js"

const router = express.Router()

// Get all events for the Map page
router.get("/map/events", (req, res) => {
  res.json(events)
})

export default router