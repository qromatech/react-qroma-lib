import React, { useContext } from "react"
import { QromaPageAppContext } from "../page-app/QromaPageAppContext";


export const WebSerialSupportBadge = () => {
  
  const qromaPageApp = useContext(QromaPageAppContext);

  return (
    <div>
      Does your browser support web serial? {qromaPageApp.qromaPageSerial.isBrowserSupported ? "Yes" : "No"}
    </div>
  )
}
