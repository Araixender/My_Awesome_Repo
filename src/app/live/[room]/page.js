"use client";
import { useParams, useRouter } from "next/navigation";
import Pusher from "pusher-js";
import React, { useContext, useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { GeolocateControl, Marker, NavigationControl } from "react-map-gl";
import { DashboardContext } from "@/dashboardContext/dashboard";
import { verifyChat } from "@/ImportantFunctions/chat";

function LiveFunction() {
  const params = useParams();
  const channelId = "live" + params.room.split("-")[0];
  const eventId = "live" + params.room.split("-")[1];
  const [myLocation, setLocation] = useState();
  const {user, userDoc} = useContext(DashboardContext)
  const router = useRouter()

  const liveLocationGetter = () => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "eu",
      encrypted: true,
    });
    const channel = pusher.subscribe(channelId);
    channel.bind(eventId, (data) => {
      // console.log(data);
      setLocation(data);
    });
  };

  useEffect(() => {
    liveLocationGetter();
  }, []);

  useEffect(() => {
    if (!user && !userDoc){
      router.push("/live/login?code="+params.room)
    }
    if(user){
      (async () => {
        const chatRes = await verifyChat(params.room, user.email)
        // Return 
        // if (!chatRes) return router.push("/")
      })()
    }
  }, [user])

  return (
    <>
      {myLocation ? (
        <div>
          <Map
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAP_TOKEN}
            initialViewState={{
              longitude: myLocation.longitude,
              latitude: myLocation.latitude,
              zoom: 16,
            }}
            style={{ width: 1350, height: 650 }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
            <Marker
              longitude={myLocation.longitude}
              latitude={myLocation.latitude}
              anchor="bottom"
            ></Marker>
            <NavigationControl />
          </Map>
        </div>
      ) : (
        <div className="min-h-screen bg-indigo-500 flex justify-center items-center">
            <div className="bg-indigo-950 py-10 px-4 rounded-lg border-2">
            <h1 className="text-2xl font-semibold text-white">Rider is not active</h1>
            </div>
          
        </div>
      )}
    </>
  );
}

export default LiveFunction;
