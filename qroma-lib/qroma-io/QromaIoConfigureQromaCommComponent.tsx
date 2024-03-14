

// import React, { useState } from "react"
// import { useQromaCommWebSerial } from "../webserial/QromaCommWebSerial";
// import { QromaCommResponse } from "../../qroma-comm-proto/qroma-comm";
// import { IQromaConnectionState } from "../webserial/QromaWebSerial";
// import { QromaCommConfigResponse } from "../../qroma-comm-proto/qroma-comm-config-commands";


// interface IQromaIoConfigureQromaCommComponentProps {
//   // fileMessageType: MessageType<T>
//   // filePath: string
// }


// export const QromaIoConfigureQromaCommComponent = (
//   props: IQromaIoConfigureQromaCommComponentProps
// ) => {

//   const [connectionState, setConnectionState] = useState({
//     isConnected: false,
//     isPortConnected: false,
//     isMonitorOn: false,
//   } as IQromaConnectionState);

//   const [commConfigJsonStr, setCommConfigJsonStr] = useState("");


//   const onQromaCommResponse = (message: QromaCommResponse) => {
//     if (message.response.oneofKind === 'commConfigResponse') {
//       const commConfig = message.response.commConfigResponse;
//       setCommConfigJsonStr(QromaCommConfigResponse.toJsonString(commConfig));
//     }
//   }

//   const onConnectionChange = (latestConnection: IQromaConnectionState) => {
//     console.log("CONN CHANGE")
//     console.log(latestConnection)
//     setConnectionState(latestConnection);
//   }

//   const qromaCommWebSerial = useQromaCommWebSerial(onQromaCommResponse, onConnectionChange);
//   const isConnected = qromaCommWebSerial.getConnectionState().isWebSerialConnected;


//   const showConfig = () => {

//   }

//   const startConnection = () => {
//     qromaCommWebSerial.startMonitoring();
//     console.log("qromaCommWebSerial - startMonitoring CALLED");
//   }

  
//   return (
//     <div>
//       <div>QromaIoConfigureQromaCommComponent!!!</div>
//       {/* <div>FILEPATH: {filePath}</div> */}
//       {isConnected ? 
//         <button onClick={() => showConfig() }>Show config</button> :
//         <button onClick={() => startConnection() }>Start Connection!</button> 
//       }
//       {/* <div>File Message JSON</div>
//       <div>{fileMessageJson}</div> */}
//     </div>
//   )
// }
