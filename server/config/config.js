import dotenv from 'dotenv'

dotenv.config()

export const company = process.env.companyName

export const port = process.env.PORT3 || 5002

export const mongodb = process.env.MONGODB
export const jwtSec = process.env.jwt_secret
export const node_env = process.env.node_env

export const user = process.env.smtp_use
export const pass = process.env.smtp_pass

export const senderEmail = process.env.sender_email