import React, { useContext, useState } from "react"
import { QromaPageAppContext } from "../page-app/QromaPageAppContext";
import Link from "@docusaurus/Link";


export const NavbarConnectionComponent = () => {

  const qromaPageApp = useContext(QromaPageAppContext);
  const qromaConnectionState = qromaPageApp.qromaConnectionState;

  if (!qromaPageApp.qromaPageSerial.isBrowserSupported) {
    return (
      <Link to="webserial-not-supported">
        Web Serial Not Supported
      </Link>
    )
  }

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
      <div>Web Serial Connected: {qromaConnectionState.isWebSerialConnected ? "Yes" : "No"}</div>
      <div>Monitoring: {getMonitoringLabel()}</div>
    </div>
  )
}