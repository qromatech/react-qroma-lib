import React, { useEffect, useState } from "react";
import { Buffer } from 'buffer';
import { MessageType } from "@protobuf-ts/runtime";
import { QromaCommCommand, QromaCommResponse, QromaRequestForm } from "..";
import { useQromaPageSerial } from "./webserial/QromaPageSerial";
import { createQromaAppRx } from "./webserial/processors/QromaAppRx";
import { createQromaCommTx } from "./webserial/processors/QromaCommTx";
import { QcuCreateQromaCommAppCommandBytesMessageForAppCommand } from "./QromaCommUtils";


interface IQromaCommandDeviceAppProps<T extends object, U extends object> {
  requestMessageType: MessageType<T>
  responseMessageType: MessageType<U>
}


export const QromaCommandDeviceApp = <T extends object, U extends object>(props: IQromaCommandDeviceAppProps<T, U>) => {
  
  const [qromaAppResponse, setQromaAppResponse] = useState(props.responseMessageType.create());
  const [isPortConnected, setIsPortConnected] = useState(false);
  const [isPortRequestSuccessful, setIsPortRequestSuccessful] = useState(false);


  // const inputs: IUseQromaAppPageSerialInputs<T, U> = {
  //   onQromaAppResponse: (appMessage: U) => {
  //     console.log("QromaRequestForm - onQromaAppResponse!!");
  //     console.log(appMessage);
  //     setQromaAppResponse(appMessage);
  //   },
  //   onQromaCommResponse: (message: QromaCommResponse) => {
  //     console.log("QromaRequestForm - onQromaCommResponse!!");
  //     console.log(message);
  //   },
  //   commandMessageType: props.requestMessageType,
  //   responseMessageType: props.responseMessageType,
  //   // onPortRequestResult: (requestResult: PortRequestResult) => { 
  //   //   console.log("PORT REQUEST RESULT");
  //   //   console.log(requestResult);
  //   //   if (requestResult.success) {
  //   //     setIsPortConnected(true);
  //   //   } else {
  //   //     setIsPortConnected(false);
  //   //   }
  //   // }
  // }
  // const qromaWebSerial = useQromaAppWebSerial(inputs);
  // const qromaWebSerial = useInitQromaAppWebSerial(inputs);
  // const qromaWebSerial = useQromaPageSerial(inputs);

  console.log("REQUEST MESSAGE TYPE");
  console.log(props.requestMessageType);

  const onQromaCommResponse = (message: QromaCommResponse) => {
    console.log("QromaCommandDeviceApp - onQromaCommResponse!!");
    console.log(message);
  };


  const onLatestQromaAppResponse = (appMessage: U) => {
    console.log("QromaRequestForm - onQromaAppResponse!!");
    console.log(appMessage);
    setQromaAppResponse(appMessage);
  };

  // const qromaAppTx = createQromaAppTx<T>({

  // });


  const sendQromaCommCommand = () => {

  }

  const sendQromaAppCommand = async (appCommand: T) => {
    console.log("sendQromaAppCommand")
    console.log(appCommand);
    console.log(props);
    
    const qcAppCommand = QcuCreateQromaCommAppCommandBytesMessageForAppCommand(appCommand, props.requestMessageType);
    const qcAppCommandBytes = QromaCommCommand.toBinary(qcAppCommand);
    const requestB64 = Buffer.from(qcAppCommandBytes).toString('base64') + "\n";

    await qromaPageSerial.sendString(requestB64);  
  }

  const qromaPageSerial = useQromaPageSerial();

  useEffect(() => {
    const qromaAppRx = createQromaAppRx<U>({
      qromaPageSerial,
      responseMessageType: props.responseMessageType,
      onQromaAppResponse: onLatestQromaAppResponse,
    });

    const qromaCommTx = createQromaCommTx({
      qromaPageSerial,
      sendQromaCommCommand
    });

    qromaPageSerial.listen({
      onConnect: () => setIsPortConnected(true),
      onDisconnect: () => {
        setIsPortConnected(false);
        setIsPortRequestSuccessful(false);
      },
      onData: () => { },
      onPortRequestResult: (prr) => {
        if (prr.success) {
          setIsPortRequestSuccessful(true);
        }
        setIsPortConnected(prr.success);
      }
    })


    // const qromaCommPageSerial = useQromaCommPageSerial();

    // const inputs: IUseQromaAppPageSerialInputs<T, U> = {
    //   // qromaCommPageSerial
    //   onQromaAppResponse: onLatestQromaAppResponse,
    //   onQromaCommResponse: (qcr) => {},
    //   qromaCommPageSerial
    // };
  
    // const qromaAppPageSerial = useQromaAppPageSerial<T, U>(inputs);
    return () => {
      // qromaPageSerial.unsubscribe();
      qromaAppRx.unsubscribe();
    }
  });

  
  return (
    <>
      {props.requestMessageType.typeName} => {props.responseMessageType.typeName}

      <div>
        Serial Connected? { qromaPageSerial.getIsConnected() ? "Yes" : "No" } / { isPortConnected ? "Yes" : "No" }
      </div> 

      <QromaRequestForm
        requestMessageType={props.requestMessageType}
        responseMessageType={props.responseMessageType}
        // qromaWebSerial={qromaWebSerial}
        sendQromaAppCommand={sendQromaAppCommand}
        qromaPageSerial={qromaPageSerial}
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