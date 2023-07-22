import React from "react";
import { QromaCommFileExplorerUiComponent } from "./QromaCommFileExplorerUiComponent";
import { QromaCommFileSystemApi } from "./QromaCommFileSystemApi";

// @ts-ignore
import { Buffer } from 'buffer';


export const QromaCommFileExplorerComponent = () => {

  // const [isConnected, setIsConnected] = useState(false);

  // const onQromaCommMessage = (message: QromaCommResponse) => {
  //   console.log("ON QROMA COMM MESSAGE");
  //   console.log(message);

  //   if (message.response.oneofKind === 'fsResponse') {
  //     switch (message.response.fsResponse.response.oneofKind) {
  //       case 'reportFileDataResponse':
  //         setMsg(JSON.stringify(message.response.fsResponse.response.reportFileDataResponse));
  //         break;
  //       case 'getFileContentsResponse':
  //         setMsg(message.response.fsResponse.response.getFileContentsResponse.fileBytes.toString());
  //         break;
  //     }
  //   }
  // }

  // const startMonitoring = () => {
  // //   if (qromaCommWebSerial) {
  // //     setIsConnected(true);
  // //     qromaCommWebSerial.startMonitoring();
  // //   }
  //   qromaCommFileSystemApi.init();
  //   setIsConnected(true);
  // }

  // const useQromaCommWebSerialInputs = {
  //   onQromaCommMessage,
  //   onConnect: () => { console.log("SERIAL CONNECTED"); },
  //   onDisconnect: () => { console.log("SERIAL DISCONNECTED"); },
  // } as IUseQromaCommWebSerialInputs;

  // const qromaCommWebSerial = useQromaCommWebSerial(useQromaCommWebSerialInputs);
  // const qromaCommFileSystemApi = QromaCommFileSystemApi(qromaCommWebSerial!);
  const qromaCommFileSystemApi = QromaCommFileSystemApi();

  // if (!isConnected) {
  //   return (
  //     <div>
  //       <button onClick={() => startMonitoring() }>START EXPLORER</button>
  //     </div>
  //   )
  // }


  return (
    <QromaCommFileExplorerUiComponent
      qromaCommFileSystemApi={qromaCommFileSystemApi}
      />
  )



  // const [msg, setMsg] = useState("");

  

  

  // const getFileDetails = async () => {
  //   if (qromaCommWebSerial) {
  //     await qromaCommWebSerial.getFileDetails("/testFile.txt");      
  //   }
  // }

  // const getFileContents = async () => {
  //   if (qromaCommWebSerial) {
  //     await qromaCommWebSerial.getFileContents("/ts_test.txt");      
  //   }
  // }

  // const writeFileContents = async () => {
  //   if (qromaCommWebSerial) {
  //     const contents = "The quick brown fox jumped over the lazy dogs.";
  //     const bytesToWrite = new TextEncoder().encode(contents);
  //     await qromaCommWebSerial.writeFileContents("/d1/ts_test.txt", bytesToWrite);
  //   }
  // }


  // const listDir = async () => {
  //   if (qromaCommWebSerial) {
  //     const dirPath = "/d1/";
  //     await qromaCommWebSerial.listDir(dirPath);
  //   }
  // }

  // const parseQromaCommResponse = () => {
  //   const b64String = "EhE6DwoNL3Rlc3RGaWxlLnR4dA==";
  //   // const b64String = new TextDecoder().decode(b64Bytes);
  //   console.log("RESPONSE: " + b64String);
  //   const messageBytes = Buffer.from(b64String, 'base64');
  //   // console.log(messageBytes);
  //   const response = QromaCommResponse.fromBinary(messageBytes);
  //   console.log("PARSED QROMACOMM RESPONSE");
  //   console.log(response);
  // }

  // useEffect(() => {
    
  // });

  
  // return (
  //   <div>
  //     Qroma comm dev x - {msg}

  //     {/* <button onClick={() => startMonitoring() }>START MONITORING</button>
  //     <button onClick={() => getFileDetails() }>GET FILE DETAILS</button>
  //     <button onClick={() => getFileContents() }>GET FILE CONTENTS</button>
  //     <button onClick={() => writeFileContents() }>WRITE FILE CONTENTS</button>
  //     <button onClick={() => listDir() }>LIST DIR CONTENTS</button>
  //     <button onClick={() => parseQromaCommResponse() }>PARSE QROMA COMM RESPONSE</button> */}

  //   </div>
  // )
}
