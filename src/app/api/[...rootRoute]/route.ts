// IMPORTING NECESSARY FILES
    // IMPORTING SERVER ITEMS
import { NextRequest, NextResponse } from "next/server";
    // IMPORTING MIDDLEWARE
import eventLogger from "@/libs/eventLogger";

// AN ENDPOINT FOR THE ROOTROUTE
function handler(request: NextRequest){
    eventLogger(request.nextUrl.pathname, request.method, "eventLogs.txt")
    return NextResponse.json({})
}

export {handler as GET, handler as POST, handler as PUT, handler as DELETE}