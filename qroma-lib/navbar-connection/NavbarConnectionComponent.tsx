import React, { useContext, useState } from "react"
import { QromaPageAppContext } from "../page-app/QromaPageAppContext";


export const NavbarConnectionComponent = () => {

  const qromaPageApp = useContext(QromaPageAppContext);
  const qromaConnectionState = qromaPageApp.qromaConnectionState;

  return (
    <div>
      <div>Port Connected: {qromaConnectionState.isConnected ? "Yes" : "No"}</div>
      <div>QromaWS Connected: {qromaConnectionState.isPortConnected ? "Yes" : "No"}</div>
      <div>Monitoring: {qromaConnectionState.isMonitorOn ? "Yes" : "No"}</div>
    </div>
  )
}