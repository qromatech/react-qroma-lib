import React, { useState } from "react"
import { PortRequestResult } from "..";
import { QromaCoreCommand, QromaCoreResponse } from "../qroma-comm-proto/qroma-core";
import { IUseQromaCoreWebSerialInputs, useQromaCoreWebSerial } from "./webserial/QromaCoreWebSerial";
import { QromaCoreRequestForm } from "./QromaCoreRequestForm";


interface IQromaCoreDeviceAppProps {

}


export const QromaCoreDeviceApp = (props: IQromaCoreDeviceAppProps) => {
  
  const [qromaCoreNonHeartbeatResponse, setQromaCoreNonHeartbeatResponse] = useState(QromaCoreResponse.create());
  const [qromaCoreHeartbeatResponse, setQromaCoreHeartbeatResponse] = useState(QromaCoreResponse.create());
  const [isPortConnected, setIsPortConnected] = useState(false);
  // const [ignoreHeartbeatMessages, setIgnoreHeartbeatMessages] = useState(true);
  // console.log("IGNORE CHECKED - " + ignoreHeartbeatMessages);

  const inputs: IUseQromaCoreWebSerialInputs = {
    onQromaCoreResponse: (coreResponse: QromaCoreResponse) => {
      console.log("QromaCoreDeviceApp - onQromaCoreResponse!!");
      if (coreResponse.response.oneofKind === 'heartbeat')
      {
        setQromaCoreHeartbeatResponse(coreResponse);
      } else {
        setQromaCoreNonHeartbeatResponse(coreResponse);
      }

      // console.log(coreResponse);
      // // console.log(ignoreHeartbeatMessages);
      // console.log("SETTING QROMA CORE RESPONSE");
      // setQromaCoreResponse(coreResponse);
    },
    onPortRequestResult: (requestResult: PortRequestResult) => { 
      if (requestResult.success === isPortConnected) {
        console.log("don't need to update port request result: " + isPortConnected);
        return;
      }

      console.log("PORT REQUEST RESULT");
      console.log(requestResult);
      console.log(isPortConnected);

      if (requestResult.success) {
        setIsPortConnected(true);
      } else {
        setIsPortConnected(false);
      }
    }
  }

  const qromaCoreWebSerial = useQromaCoreWebSerial(inputs);
  const isQromaWebSerialConnected = qromaCoreWebSerial.getConnectionState().isWebSerialConnected;

  const startConnection = () => {
    console.log("START CONNECTION");
    qromaCoreWebSerial.startMonitoring();
  }

  return (
    <>
      {QromaCoreCommand.typeName} => {QromaCoreResponse.typeName}

      {isQromaWebSerialConnected ? 
      <QromaCoreRequestForm
        qromaWebSerial={qromaCoreWebSerial}
        />
        :
        <div>
          <button onClick={() => startConnection() }>Start Connection!</button> 
        </div>
      }

      <div>
        <div>
          Core Response: {JSON.stringify(qromaCoreNonHeartbeatResponse)}
        </div>
        <div>
          Heartbeat Response: {JSON.stringify(qromaCoreHeartbeatResponse)}
        </div>
      </div>      
    </>
  )
}