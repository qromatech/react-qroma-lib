import React, { useState } from "react"
import { IUseQromaWebSerialInputs, useQromaWebSerial } from "./webserial/QromaWebSerial";


export const QromaStrMonitor = () => {
  
  const [response, setResponse] = useState("NOT SET");
  
  let rxBuffer = new Uint8Array();

    const setRxBuffer = (update: Uint8Array) => {
      rxBuffer = update;
    }

  const onData = (newData: Uint8Array) => {
    // console.log("STR RECEIVED");
    // console.log(newData);

    let currentRxBuffer = new Uint8Array([...rxBuffer, ...newData]);

    let firstNewLineIndex = 0;

    while (firstNewLineIndex !== -1) {
      firstNewLineIndex = currentRxBuffer.findIndex(x => x === 10);

      if (firstNewLineIndex === -1) {
        setRxBuffer(currentRxBuffer);
        return;
      }

      if (firstNewLineIndex === 0) {
        currentRxBuffer = currentRxBuffer.slice(1, currentRxBuffer.length);
        continue;
      }

      try {
        const fullMessage = currentRxBuffer.slice(0, firstNewLineIndex);
        currentRxBuffer = currentRxBuffer.slice(firstNewLineIndex, currentRxBuffer.length);

        const decoder = new TextDecoder();
        const decoded = decoder.decode(fullMessage);

        setResponse(decoded);
        console.log("DECODED: " + decoded);
  
      } catch (e) {
        console.log("CAUGHT ERROR");
        console.log(e);
      }
    }

    setRxBuffer(currentRxBuffer);
  }

  const inputs: IUseQromaWebSerialInputs = {
    onData,
    onPortRequestResult: () => { console.log("PORT REQUEST COMPLETE") }
  }

  const qromaWebSerial = useQromaWebSerial(inputs);
  
  if (qromaWebSerial === null) {
    return (
      <>
        Serial not supported
      </>
    )
  }

  // const startMonitoring = async () => {
  //   let rxBuffer = new Uint8Array();

  //   const setRxBuffer = (update: Uint8Array) => {
  //     rxBuffer = update;
  //   }

  //   const onData = (newData: Uint8Array) => {
  //     // console.log("STR RECEIVED");
  //     // console.log(newData);

  //     let currentRxBuffer = new Uint8Array([...rxBuffer, ...newData]);

  //     let firstNewLineIndex = 0;

  //     while (firstNewLineIndex !== -1) {
  //       firstNewLineIndex = currentRxBuffer.findIndex(x => x === 10);

  //       if (firstNewLineIndex === -1) {
  //         setRxBuffer(currentRxBuffer);
  //         return;
  //       }

  //       if (firstNewLineIndex === 0) {
  //         currentRxBuffer = currentRxBuffer.slice(1, currentRxBuffer.length);
  //         continue;
  //       }

  //       try {
  //         const fullMessage = currentRxBuffer.slice(0, firstNewLineIndex);
  //         currentRxBuffer = currentRxBuffer.slice(firstNewLineIndex, currentRxBuffer.length);

  //         const decoder = new TextDecoder();
  //         const decoded = decoder.decode(fullMessage);

  //         setResponse(decoded);
  //         console.log("DECODED: " + decoded);
    
  //       } catch (e) {
  //         console.log("CAUGHT ERROR");
  //         console.log(e);
  //       }
  //     }
  
  //     setRxBuffer(currentRxBuffer);
  //   }
  
  //   qromaWebSerial.startMonitoring();
  // }


  return (
    <>
      Qroma monitor
      <button onClick={async () => {
        const port = await qromaWebSerial.requestPort();
        console.log("PORT");
        console.log(port);
        qromaWebSerial.startMonitoring();
      }}>
        Start monitor
      </button>
      <button onClick={() => {
        qromaWebSerial.stopMonitoring();
      }}>
        Stop monitor
      </button>
      <div>
        {response}
      </div> 
    </>
  )
}