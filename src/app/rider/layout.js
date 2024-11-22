"use client"
import { DashboardContext } from '@/dashboardContext/dashboard'
import { locationSharer, RiderLinksFetchs } from '@/ImportantFunctions/live'
import React, { useContext, useEffect, useState } from 'react'

function Riders({ children }) {
  const { user } = useContext(DashboardContext)
  const [linkData, setlinkData] = useState(null);
  const dataFetcher = async () => {
    try {
      if(user){
        const data = await RiderLinksFetchs(user.email)
        setlinkData(data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    const trackPosition = async (position) => {
      const { latitude, longitude } = position.coords;
      if(!linkData){
        dataFetcher()
      }
      // console.log(linkData)
      locationSharer(linkData, latitude, longitude)
    }
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(trackPosition);
    } else {
      alert("geolocation is not supported in your browser.");
    }

  
  }, [, linkData])

  useEffect(() => {
    if(user) dataFetcher()
  }, [user])
  return (
    <div>
      {children}
    </div>
  )
}

export default Riders