import React, { useContext, useState } from "react"
import { QromaPageAppContext } from "../page-app/QromaPageAppContext";


export const NavbarConnectionComponent = () => {

  const qromaPageApp = useContext(QromaPageAppContext);
  const qromaConnectionState = qromaPageApp.qromaConnectionState;

  console.log("RENDING NavbarConnectionComponent")
  console.log(qromaConnectionState)

  const getMonitoringLabel = () => {
    if (qromaConnectionState.keepQromaMonitoringOn) {
      if (qromaConnectionState.isQromaMonitoringOn) {
        return "Yes";
      }
      return "Should be on, but isn't";
    }

    if (!qromaConnectionState.keepQromaMonitoringOn) {
      if (!qromaConnectionState.isQromaMonitoringOn) {
        return "No"
      }
      return "Should not be on, but it is"
    }
  }

  return (
    <div>
      <div>WebSerial Connected: {qromaConnectionState.isWebSerialConnected ? "Yes" : "No"}</div>
      <div>Monitoring: {getMonitoringLabel()}</div>
    </div>
  )
}