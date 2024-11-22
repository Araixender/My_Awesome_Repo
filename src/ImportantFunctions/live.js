
import { databases } from "@/appwrite/appwrite"
import { Query } from "appwrite"

export const RiderLinksFetchs = async (email) => {
    try {
        const res = await databases.listDocuments(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_CHAT_COLLECTION_ID,
            [
                Query.equal('rider_email', email)
            ]
        )
        return res.documents
    } catch (error) {
        return null
    }
}

/*

const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(trackPosition);
    } else {
      alert("geolocation is not supported in your browser.");
    }
  };

const trackPosition = async (position) => {
    const { latitude, longitude } = position.coords;
    console.log(latitude, longitude)
}


*/

// share location to all channels and events through rest api
export const locationSharer = async (locationslist, latitude, longitude) => {
    if (locationslist) {
        locationslist.map(async e => {
            const channelId = "live" + e.link.split("-")[0]
            const eventId = "live" + e.link.split('-')[1]
            // console.log(channelId, eventId, locationslist, latitude)
            try {
                const res = await fetch('/api/live', {
                    method: "POST",
                    body: JSON.stringify({
                        latitude,
                        longitude,
                        channelId,
                        eventId
                    }),
                    "content-type": "application/json"
                })
                // console.log(await res.json())
            } catch (error) {
                console.log(error)
            }
        })
    }
}