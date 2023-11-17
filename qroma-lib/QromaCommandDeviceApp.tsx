import React, { useContext, useEffect, useState } from "react";
import { Buffer } from 'buffer';
import { MessageType } from "@protobuf-ts/runtime";
import { QromaCommCommand, QromaCommResponse, QromaRequestForm } from "..";
// import { useQromaPageSerial } from "./webserial/QromaPageSerial";
import { createQromaAppRx } from "./webserial/processors/QromaAppRx";
// import { createQromaCommTx } from "./webserial/processors/QromaCommTx";
import { QcuCreateQromaCommAppCommandBytesMessageForAppCommand } from "./QromaCommUtils";
import { QromaPageSerialContext } from "./webserial/QromaPageSerialContext";
import { QromaPageAppContext } from "./webserial/QromaPageAppContext";


interface IQromaCommandDeviceAppProps<T extends object, U extends object> {
  requestMessageType: MessageType<T>
  responseMessageType: MessageType<U>
}


export const QromaCommandDeviceApp = <T extends object, U extends object>(props: IQromaCommandDeviceAppProps<T, U>) => {
  
  const [qromaAppResponse, setQromaAppResponse] = useState(props.responseMessageType.create());
  // const [isPortConnected, setIsPortConnected] = useState(false);
  // const [isPortRequestSuccessful, setIsPortRequestSuccessful] = useState(false);

  console.log("REQUEST MESSAGE TYPE");
  console.log(props.requestMessageType);

  const onLatestQromaAppResponse = (appMessage: U) => {
    console.log("QromaRequestForm - onQromaAppResponse!!");
    console.log(appMessage);
    setQromaAppResponse(appMessage);
  };

  const sendQromaAppCommand = async (appCommand: T) => {
    console.log("sendQromaAppCommand")
    console.log(appCommand);
    console.log(props);
    
    const qcAppCommand = QcuCreateQromaCommAppCommandBytesMessageForAppCommand(appCommand, props.requestMessageType);
    const qcAppCommandBytes = QromaCommCommand.toBinary(qcAppCommand);
    const requestB64 = Buffer.from(qcAppCommandBytes).toString('base64') + "\n";

    await qromaPageSerial.sendString(requestB64);  
  }

  // const qromaPageSerial = useQromaPageSerial();

  // useEffect(() => {
  //   const initComm = async () => {
  //     const qromaAppRx = createQromaAppRx<U>({
  //       qromaPageSerial,
  //       responseMessageType: props.responseMessageType,
  //       onQromaAppResponse: onLatestQromaAppResponse,
  //     });

  //     const qpsUnsubscribe = qromaPageSerial.listen({
  //       // onConnect: () => setIsPortConnected(true),
  //       onConnect: () => { },
  //       onDisconnect: () => {
  //         setIsPortConnected(false);
  //         setIsPortRequestSuccessful(false);
  //       },
  //       onData: () => { },
  //       onPortRequestResult: (prr) => {
  //         // if (prr.success) {
  //         //   setIsPortRequestSuccessful(true);
  //         // }
  //         // setIsPortConnected(prr.success);
  //       }
  //     });

  //     return () => {
  //       qromaAppRx.unsubscribe();
  //       qpsUnsubscribe();
  //     }
  //   };

  //   initComm();
  // });

  // const qromaPageSerial = useQromaPageSerial();
  // const qromaPageSerial = useContext(QromaPageSerialContext);
  const qromaPageApp = useContext(QromaPageAppContext);
  const qromaPageSerial = qromaPageApp.qromaPageSerial;

  useEffect(() => {
    const qromaAppRx = createQromaAppRx<U>({
      qromaPageSerial,
      responseMessageType: props.responseMessageType,
      onQromaAppResponse: onLatestQromaAppResponse,
    });
  
    return qromaAppRx.unsubscribe;
  })

  // useEffect(() => {
  //   console.log("USING EFFECT - device app")
  //   const initListeners = () => {
  //     const unsubscribe = qromaPageSerial.listen({
  //       // onConnect: () => {
  //       //   console.log("ON CONNECT");
  //       //   setIsPortConnected(true);
  //       // },
  //       // // onConnect: () => { },
  //       // onDisconnect: () => {
  //       //   setIsPortConnected(false);
  //       //   setIsPortRequestSuccessful(false);
  //       // },
  //       onData: (data) => {
  //         console.log("DEVICE APP DATA2");
  //         console.log(data);
  //       },
  //       onPortRequestResult: (prr) => {
  //         // if (prr.success) {
  //         //   setIsPortRequestSuccessful(true);
  //         // }
  //         // setIsPortConnected(prr.success);
  //       }
  //     });
 
  //   }

  //   initListeners();
  //   // return unsubscribe;
  // })

  // qromaPageSerial.listen({
  //   // onConnect: () => {
  //   //   console.log("ON CONNECT");
  //   //   setIsPortConnected(true);
  //   // },
  //   // // onConnect: () => { },
  //   // onDisconnect: () => {
  //   //   setIsPortConnected(false);
  //   //   setIsPortRequestSuccessful(false);
  //   // },
  //   onData: (data) => {
  //     console.log("DEVICE APP DATA1");
  //     console.log(data);
  //   },
  //   onPortRequestResult: (prr) => {
  //     // if (prr.success) {
  //     //   setIsPortRequestSuccessful(true);
  //     // }
  //     // setIsPortConnected(prr.success);
  //   }
  // });

  
  return (
    <>
      {props.requestMessageType.typeName} => {props.responseMessageType.typeName}

      <div>
        Serial Connected? { qromaPageSerial.isConnected ? "Yes" : "No" } / { qromaPageSerial.isPortConnected ? "Yes" : "No" }
      </div> 

      <QromaRequestForm
        requestMessageType={props.requestMessageType}
        responseMessageType={props.responseMessageType}
        sendQromaAppCommand={sendQromaAppCommand}
        // qromaPageSerial={qromaPageSerial}
        />

      <div>
        QC Response: 
      </div>
      <div>
        App Response: {JSON.stringify(qromaAppResponse)}
      </div>
{/* 
      <QromaCommMonitor
        responseMessageType={props.responseMessageType}
        qromaWebSerial={qromaWebSerial}
        /> */}
    </>
  )
}