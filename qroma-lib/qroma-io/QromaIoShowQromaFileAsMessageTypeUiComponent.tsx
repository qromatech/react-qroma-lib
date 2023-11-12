import React, { useState } from "react"
import { useLocation } from "@docusaurus/router";
import { IQromaCommFilesystemApi } from "../file-explorer/QromaCommFileSystemApi";
import { MessageType } from "@protobuf-ts/runtime";
import { QromaAppMessageTypes } from "../../../qroma-app/QromaAppMessageTypes";
import { useQromaSiteAppContext } from "../QromaSiteApp";


interface IQromaIoShowQromaFileAsMessageTypeUiComponentProps<T extends object> {
  fileMessageType: MessageType<T>
  filePath: string
  qromaCommFileSystemApi: IQromaCommFilesystemApi
}


export const QromaIoShowQromaFileAsMessageTypeUiComponent = <T extends object>(
  props: IQromaIoShowQromaFileAsMessageTypeUiComponentProps<T>
) => {

  const [isConnected, setIsConnected] = useState(false);
  const [fileMessageJson, setFileMessageJson] = useState("");

  // const location = useLocation();
  // console.log(location);

  // const hash: string = location.hash;
  // const isValid = hash.startsWith("#/");

  // const fileTypeStr = "QromaLightsConfig";
  // const fileMessageType = QromaAppMessageTypes[fileTypeStr];

  const siteApp = useQromaSiteAppContext();
  // const fileMessageType = siteApp.appMessageTypesRegistry.getMessageTypeForName(fileTypeStr);
  // const mts = siteApp.appMessageTypesRegistry.getAllMessageTypes();
  const fileMessageType = props.fileMessageType;

  console.log("FILE MESSAGE TYPE");
  console.log(fileMessageType);
  // console.log(mts)
  // console.log(mts[fileTypeStr]);
  // console.log(mts["QromaLightsConfig"])
  // MessageInfo

  // const filePath = hash.substring(1);
  const filePath = props.filePath;

  // if (!isValid) {
  //   return <div>
  //     Invalid Qroma file path [{filePath}]. Paths must start with <b>#/</b>.
  //   </div>
  // }

  if (fileMessageType === undefined) {
    return <div>
      Invalid Qroma file message type.
    </div>
  }

  const qromaCommFileSystemApi = props.qromaCommFileSystemApi;

  const onConnection = (success: boolean) => {
    console.log("EXPLORER ON CONNECTION");
    console.log(success);
    if (success) {
      setIsConnected(true);
    }
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
    qromaCommFileSystemApi.init(onConnection);
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
