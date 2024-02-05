// IMPORTING NECESSARY FILES
    // IMPORTING MODULES
import jwt from "jsonwebtoken"
    // IMPORTING TYPES
import {UserID} from "@/types/Types"

// A FUNCTION TO SIGN A JWT
export function jwtSign(userID: UserID): string{
    return jwt.sign(userID, process.env.JWT_SECRET!, { expiresIn: "1d" })
}

// A FUNCTION TO VERIFY A JWT
export function verifyJWT(token: string): string | jwt.JwtPayload{
    return jwt.verify(token, process.env.JWT_SECRET!)
}