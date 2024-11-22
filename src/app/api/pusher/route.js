import { pusher } from "@/lib/pusher";
import { NextResponse } from "next/server";


export async function POST(req) {
    const {message, channelId, eventId, rider} = await req.json();
    try {
        const res = await pusher.trigger(channelId, eventId, {
          message,
          rider
        });
        return NextResponse.json({message: "MESSAGE HAS BEEN SEND"})
    } catch (error) {
        return NextResponse.json({message: "MESSAGE COULD NOT BE SEND"}, {status: 400})
    }
}