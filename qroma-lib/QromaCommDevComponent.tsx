// import React, { useEffect, useState } from "react";
// import { useQromaCommWebSerial } from "./webserial/QromaCommWebSerial";
// import { QromaCommResponse } from "../qroma-comm-proto/qroma-comm";



// export const QromaCommDevComponent = () => {

//   const [msg, setMsg] = useState("");

//   const onQromaCommMessage = (message: QromaCommResponse) => {
//     console.log("ON QROMA COMM MESSAGE");
//     console.log(message);
//     setMsg(JSON.stringify(message));
//   }

//   const qromaCommWebSerial = useQromaCommWebSerial({
//     onQromaCommMessage,
//   });

//   // const getFileData = async () => {
//   //   if (qromaCommWebSerial) {
//   //     await qromaCommWebSerial.getFileData("/testFile.txt");      
//   //   }
//   // }

//   const startMonitoring = () => {
//     if (qromaCommWebSerial) {
//       qromaCommWebSerial.startMonitoring();
//     }
//   }

//   useEffect(() => {
    
//   });

  
//   return (
//     <div>
//       Qroma comm dev - {msg}

//       <button onClick={() => startMonitoring() }>START MONITORING</button>
//       {/* <button onClick={() => getFileData() }>GET FILE DATA</button> */}

//     </div>
//   )
// }
