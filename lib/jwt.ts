import jwt from "jsonwebtoken"

if (!process.env.JWT_SECRET) {
  throw new Error('Invalid/Missing environment variable: "JWT_SECRET"')
}

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = "7d"

export function signToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}
