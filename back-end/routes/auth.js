import express from "express"

const router = express.Router()

const users = []

router.post("/auth/register", (req, res) => {
  const { name, email, password } = req.body || {}

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      error: "Name, email, and password are required",
    })
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: "Password must be at least 8 characters long",
    })
  }

  const normalizedEmail = email.trim().toLowerCase()

  if (users.some((user) => user.email === normalizedEmail)) {
    return res.status(409).json({
      error: "An account with this email already exists",
    })
  }

  const user = {
    id: users.length + 1,
    name: name.trim(),
    email: normalizedEmail,
    password,
  }

  users.push(user)

  res.status(201).json({
    message: "Account created successfully",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  })
})

router.post("/auth/login", (req, res) => {
  const { email, password } = req.body || {}

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      error: "Email and password are required",
    })
  }

  const user = users.find(
    (user) =>
      user.email === email.trim().toLowerCase() &&
      user.password === password
  )

  if (!user) {
    return res.status(401).json({
      error: "Invalid email or password",
    })
  }

  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  })
})

export default router
