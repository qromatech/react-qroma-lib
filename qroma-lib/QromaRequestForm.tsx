import React, { useState } from "react"
import { Buffer } from 'buffer';
import { FieldInfo, IMessageType, JsonValue } from "@protobuf-ts/runtime"
import { MessageDataViewerComponent } from './proto-components/message-data-viewer/MessageDataViewerComponent';
import { IQromaAppWebSerial } from "./webserial/QromaAppWebSerial";
import { QromaCommCommand } from "../qroma-comm-proto/qroma-comm";
import { convertBinaryToBase64 } from './utils';
import { QromaAppCommandLink } from './QromaAppCommandLink';
import { createPopulatedMessageObject } from "./proto-components/message-builder/builder_utils";
import { QromaPbMessageComponent } from "./proto-components/message-builder/QromaPbMessageComponent";


interface IQromaRequestFormProps<TCommand extends object, TResponse extends object> {
  requestMessageType: IMessageType<TCommand>
  responseMessageType: IMessageType<TResponse>
  qromaWebSerial: IQromaAppWebSerial<TCommand>
}


export const QromaRequestForm = <TCommand extends object, TResponse extends object>(props: IQromaRequestFormProps<TCommand, TResponse>) => {
  const m = props.requestMessageType;
  console.log("REQUEST MESSAGE TYPE");
  console.log(m)

  const initMessageJsonData = createPopulatedMessageObject(props.requestMessageType);
  const [rootMessageJsonData, setRootMessageJsonData] = useState(initMessageJsonData);


  const getRootMessageFromJson = () => {
    try {
      const rootMessage = props.requestMessageType.fromJson(rootMessageJsonData);
      return rootMessage;
  
    } catch (e) {
      console.log("Error trying to build message from root message JSON data")
      console.log(props.requestMessageType)
      console.log(rootMessageJsonData)
      throw e;
    }  
  }

  const rootMessage = getRootMessageFromJson();
  
  const qromaCommCommand = props.qromaWebSerial.createQromaCommMessageForAppCommand(rootMessage);
  const qromaMessageBytes = QromaCommCommand.toBinary(qromaCommCommand);
  const requestB64 = Buffer.from(qromaMessageBytes).toString('base64') + "\n";


  const updateRootField = (fieldToReplace: FieldInfo, objectValue: JsonValue) => {
    console.log("UPDATING ROOT MESSAGE VALUE IN " + props.responseMessageType.typeName);
    console.log(fieldToReplace);
    console.log(objectValue);

    console.log("OLD ROOT MESSAGE")
    console.log(rootMessageJsonData)

    if (Object.keys(rootMessageJsonData).find(f => f === fieldToReplace.name) === undefined) {
      throw new Error("UNABLE TO UPDATE ROOT VALUE FoR " + fieldToReplace.name);
    }

    const newRootMessageJsonData = {
      ...rootMessageJsonData,
      [fieldToReplace.name]: objectValue
    };

    console.log("NEW ROOT MESSAGE")
    console.log(newRootMessageJsonData)

    setRootMessageJsonData(newRootMessageJsonData);
  }

  
  const setActiveOneofInRoot = (oldActiveField: FieldInfo, newActiveField: FieldInfo, newFieldValue: JsonValue) => {
    console.log("ROOT MESSAGE UPDATE - IN setActiveOneofInRoot() FOR " + props.requestMessageType.typeName)
    console.log(oldActiveField);
    console.log(newActiveField)
    console.log(newFieldValue)

    if (newActiveField.kind === 'message') {
      console.log("QROMA PB ROOT MESSAGE UPDATE - IN setActiveOneofInMessage() FOR MESSAGE")

      const newMessageJsonData = {
        ...rootMessageJsonData,
        [newActiveField.name]: newFieldValue,
      }
      delete newMessageJsonData[oldActiveField.name];

      console.log(rootMessageJsonData)
      console.log(newMessageJsonData);
      
      setRootMessageJsonData(newMessageJsonData);

    } else {
      console.log("QROMA PB ROOT MESSAGE UPDATE - IN setActiveOneofInMessage() FOR NONMESSAGE")
      console.log(newFieldValue)

      const newMessageJsonData = {
        ...rootMessageJsonData,
        [newActiveField.name]: newFieldValue,
      }
      delete newMessageJsonData[oldActiveField.name];

      // props.setActiveOneofFieldInParentMessage(oldActiveField, newActiveField, newFieldValue);
      setRootMessageJsonData(newMessageJsonData);
    }

    // // console.trace();

    // const newRootMessageJsonData = newActiveField.kind === 'message' ? 
    //   {
    //     ...rootMessageJsonData,
    //     ...newFieldValue,
    //   } :
    //   {
    //     ...rootMessageJsonData,
    //     [newActiveField.name]: newFieldValue,
    //   };
    
    // delete newRootMessageJsonData[oldActiveField.name];

    // // if (newActiveField.kind === 'message') {
    // //   const newRootMessageJsonData = {
    // //     ...rootMessageJsonData,
    // //     ...newFieldValue,
    // //   };
    // //   delete newRootMessageJsonData[oldActiveField.name];
  
    // // } else {
    // //   const newRootMessageJsonData = {
    // //     ...rootMessageJsonData,
    // //     [newActiveField.name]: newFieldValue,
    // //   };
    // //   delete newRootMessageJsonData[oldActiveField.name];
  
    // // }

    // console.log("setActiveOneofInRoot MESSAGE - rootMessageJsonData")
    // console.log(rootMessageJsonData)

    // console.log("setActiveOneofInRoot MESSAGE - newRootMessageJsonData")
    // console.log(newRootMessageJsonData)

    // setRootMessageJsonData(newRootMessageJsonData);
  }


  const sendRequest = async () => {
    console.log("SEND COMMAND");

    const requestObject = props.requestMessageType.fromJson(rootMessageJsonData);
    const result = await props.qromaWebSerial.sendQromaAppCommand(requestObject);

    console.log("REQUEST SENT");
    console.log(result);
  }
  

  const startConnection = () => {
    console.log("START CONNECTION");
    props.qromaWebSerial.startMonitoring();
  }


  const createQromaAppMessage = () => {
    const qromaCommCommand = props.qromaWebSerial.createQromaCommMessageForAppCommand(rootMessage);
    console.log(qromaCommCommand);

    const qromaMessageBytes = QromaCommCommand.toBinary(qromaCommCommand);

    console.log(qromaMessageBytes);
    const requestB64 = Buffer.from(qromaMessageBytes).toString('base64') + "\n";
    console.log("APP MESSAGE B64");
    console.log(requestB64);
    console.log(requestB64.length);
  }


  const requestObjectJsonDataToB64 = (data) => {
    const message = data;
    const appMessageBytes = props.requestMessageType.toBinary(message);
    const appCommandB64 = convertBinaryToBase64(appMessageBytes);
    return appCommandB64;
  }


  const isQromaWebSerialConnected = props.qromaWebSerial.getConnectionState().isWebSerialConnected;
  console.log("isQromaWebSerialConnected: " + isQromaWebSerialConnected);

  let appCommandJsonStr = "";
  try {
    appCommandJsonStr = props.requestMessageType.toJsonString(props.requestMessageType.fromJson(rootMessageJsonData));
  } catch (e) {
    console.log("ERROR SETTING APP COMMAND JSON STR");
    console.log(e);
  }

  let qcCommandJsonStr = "";
  try {
    qcCommandJsonStr = QromaCommCommand.toJsonString(qromaCommCommand);
  } catch (e) {
    console.log("ERROR SETTING QROMA COMM APP COMMAND JSON STR");
    console.log(e);
  }

  console.log("ROOT MESSAGE VALUE")
  console.log(rootMessage)


  const rootMessageFieldInfo = {} as FieldInfo

  return (
    <div>
      <QromaPbMessageComponent
        key={m.typeName}
        messageType={m}
        messageName="__rootMessage__"
        messageValue={rootMessage}
        messageValueJsonData={rootMessageJsonData}
        fieldInParent={rootMessageFieldInfo}
        // isFieldUsedAsOneof={false}
        updateFieldValueInParentMessage={updateRootField}
        setActiveOneofFieldInParentMessage={setActiveOneofInRoot}
        />
      <div>
        App Command: {appCommandJsonStr}
      </div>
      <div>
        App Command B64: {requestObjectJsonDataToB64(rootMessage)}
      </div>
      <div>
        App Command Link: <QromaAppCommandLink commandAsBase64={requestObjectJsonDataToB64(rootMessage)} />
      </div>
      <div>
        QC Command: {qcCommandJsonStr}
      </div>
      <div>
        QC Command B64: [{requestB64}]
      </div>
      
      {isQromaWebSerialConnected ? 
        <button onClick={() => sendRequest() }>Send Request</button> :
        <button onClick={() => startConnection() }>Start Connection!</button> 
      }
      <button onClick={() => createQromaAppMessage() }>Show Qroma Comm Message</button>
      <MessageDataViewerComponent
        messageType={props.requestMessageType}
        messageData={rootMessage}
        />
    </div>
  )
}