// IMPORTING NECESSARY TYPES
import { NextRequest, NextResponse } from "next/server";

// AN ENDPOINT FOR THE ROOTROUTE
export function GET(request: NextRequest){
    return NextResponse.json({
        path: request.nextUrl,
        method: request.method
    }, { status: 200 })
}