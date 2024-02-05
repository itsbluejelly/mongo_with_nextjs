// IMPORTING NECESSARY FILES
    // IMPORTING SERVER ITEMS
import { NextRequest, NextResponse } from "next/server";
    // IMPORTING MIDDLEWARE
import eventLogger from "@/libs/eventLogger";
    // IMPORTING ENUMS
import { STATUS_CODES } from "@/types/Enums";

// AN ENDPOINT FOR THE ROOTROUTE
function handler(request: NextRequest){
    eventLogger(request.nextUrl.pathname, request.method, "eventLogs.txt")
    return NextResponse.json({ error: "Sorry, wrong path" }, { status: STATUS_CODES.NOT_FOUND })
}

export {
    handler as GET, 
    handler as POST, 
    handler as PUT, 
    handler as DELETE,
    handler as PATCH
}