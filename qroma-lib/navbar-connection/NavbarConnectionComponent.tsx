import React, { useContext, useEffect, useState } from "react"
// import { PortRequestResult } from "../webserial/QromaWebSerial";
// import { IQromaPageSerialListener } from "../webserial/QromaPageSerial";
// import { QromaPageSerialContext } from "../webserial/QromaPageSerialContext";
import { QromaPageAppContext } from "../webserial/QromaPageAppContext";


export const NavbarConnectionComponent = () => {

  // const [isPortConnected, setIsPortConnected] = useState(false);
  // const [qromaWebSerialIsConnected, setQromaWebSerialIsConnected] = useState(false);

  // useEffect(() => {
  //   const listener: IQromaPageSerialListener = {
  //     onData: (data: Uint8Array) => {},
  //     onConnect: () => setIsPortConnected(true),
  //     onDisconnect: () => setIsPortConnected(false),
  //     onPortRequestResult: (requestResult: PortRequestResult) => 
  //     setQromaWebSerialIsConnected(requestResult.success),
  //   };

  //   const qromaPageSerial = useQromaPageSerial();
  //   const unsubscribe = qromaPageSerial.listen(listener);
  //   return unsubscribe;
  // });

  // const listener: IQromaPageSerialListener = {
  //   onData: (data: Uint8Array) => {},
  //   onConnect: () => setIsPortConnected(true),
  //   onDisconnect: () => setIsPortConnected(false),
  //   onPortRequestResult: (requestResult: PortRequestResult) => 
  //   setQromaWebSerialIsConnected(requestResult.success),
  // };

  // const qpSerial = useQromaPageSerial();
  // qpSerial.listen(listener);

  // console.log("RENDERING NavbarConnectionComponent");

  const qromaPageApp = useContext(QromaPageAppContext);
  const qromaPageSerial = qromaPageApp.qromaPageSerial;

  return (
    <div>
      <div>Port Connected: {qromaPageSerial.isConnected ? "Yes" : "No"}</div>
      <div>QromaWS Connected: {qromaPageSerial.isPortConnected ? "Yes" : "No"}</div>
      <div>Monitoring: {qromaPageSerial.isMonitorOn ? "Yes" : "No"}</div>
    </div>
  )
}