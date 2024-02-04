// IMPORTING NECESSARY MODULES
import jwt from "jsonwebtoken"
import { Types } from "mongoose"

// A FUNCTION TO SIGN A JWT
export function jwtSign(userID: { _id: Types.ObjectId }): string{
    return jwt.sign(userID, process.env.JWT_SECRET!)
}

// A FUNCTION TO VERIFY A JWT
export function verifyJWT(token: string): string | jwt.JwtPayload{
    return jwt.verify(token, process.env.JWT_SECRET!)
}