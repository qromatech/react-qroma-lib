import React, { useState } from "react"
// import { useQromaCommFileSystemApi } from "../file-explorer/QromaCommFileSystemApi";
import { MessageType } from "@protobuf-ts/runtime";
import { IQromaCommFilesystemRxApi, useQromaCommFileSystemRxApi } from "../file-explorer/QromaCommFileSystemRxApi";


interface IQromaIoShowQromaFileAsMessageTypeUiComponentProps<T extends object> {
  fileMessageType: MessageType<T>
  filePath: string
  qromaCommFileSystemApi: IQromaCommFilesystemRxApi
}


export const QromaIoShowQromaFileAsMessageTypeUiComponent = <T extends object>(
  props: IQromaIoShowQromaFileAsMessageTypeUiComponentProps<T>
) => {

  const [fileMessageJson, setFileMessageJson] = useState("");

  const fileMessageType = props.fileMessageType;

  const filePath = props.filePath;

  // const qromaCommFileSystemApi = useQromaCommFileSystemRxApi();
  const qromaCommFileSystemApi = props.qromaCommFileSystemApi;

  const isConnected = qromaCommFileSystemApi.connectionState.isWebSerialConnected;

  if (fileMessageType === undefined) {
    return <div>
      Invalid Qroma file message type.
    </div>
  }

  
  const showFileContents = async (filePath: string) => {
    console.log("SHOWING FILE CONTENTS FOR " + filePath);
    const fileContents = await qromaCommFileSystemApi.getFileContents(filePath);
    if (fileContents === undefined) {
      console.log("Unable to read file contents for " + filePath);
      return;
    }

    console.log("FILE TYPE CONTENTS");
    console.log(filePath)
    console.log(props.fileMessageType);
    console.log(fileContents);
    console.log(fileContents.fileBytes.length)
    const decoded = new TextDecoder().decode(fileContents.fileBytes);

    console.log("FILE CONTENTS");
    console.log(decoded);

    const fileMessage = fileMessageType.fromBinary(fileContents.fileBytes);
    const fileMessageJson = fileMessageType.toJsonString(fileMessage);

    setFileMessageJson(fileMessageJson);

    alert(fileMessageJson);
  }

  const startConnection = () => {
    qromaCommFileSystemApi.init();
    console.log("qromaCommFileSystemApi - INIT CALLED");
  }

  
  return (
    <div>
      <div>QromaIoShowQromaFileComponent!!!</div>
      <div>FILEPATH: {filePath}</div>
      {isConnected ? 
        <button onClick={() => showFileContents(filePath) }>Show contents</button> :
        <button onClick={() => startConnection() }>Start Connection!</button> 
      }
      <div>File Message JSON</div>
      <div>{fileMessageJson}</div>
    </div>
  )
}
