import { pusher } from "@/lib/pusher";
import { NextResponse } from "next/server";

// start channel id from live:channelid and eventid live:eventid
export async function POST(req) {
    const {latitude, longitude, channelId, eventId} = await req.json();
    try {
        const res = await pusher.trigger(channelId, eventId, {
          latitude,
          longitude
        });
        return NextResponse.json({message: "MESSAGE HAS BEEN SEND"})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "MESSAGE COULD NOT BE SEND"}, {status: 400})
    }
}