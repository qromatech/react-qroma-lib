import React, { useState } from "react"
import { IUseQromaWebSerialInputs, PortRequestResult, useQromaWebSerial } from "../webserial/QromaWebSerial";
import { subscribeToQromaWebSerial, useInitQromaWebSerial } from "../QromaSiteApp";


export const NavbarConnectionComponent = () => {

  const [isPortConnected, setIsPortConnected] = useState(false);
  const [qromaWebSerialIsConnected, setQromaWebSerialIsConnected] = useState(false);

  const inputs: IUseQromaWebSerialInputs = {
    onData: (data: Uint8Array) => {},
    onConnect: () => setIsPortConnected(true),
    onDisconnect: () => setIsPortConnected(false),
    onPortRequestResult: (requestResult: PortRequestResult) => 
    setQromaWebSerialIsConnected(requestResult.success),
  };
  // const qromaWebSerial = useInitQromaWebSerial(inputs);
  subscribeToQromaWebSerial(inputs);

  console.log("RENDERING NavbarConnectionComponent");

  return (
    <div>
      {/* <div>Navbar Connection</div> */}
      <div>Port Connected: {isPortConnected ? "Yes" : "No"}</div>
      <div>QromaWS Connected: {qromaWebSerialIsConnected ? "Yes" : "No"}</div>
    </div>
  )
}