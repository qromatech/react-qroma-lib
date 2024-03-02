import React, { useEffect, useState } from "react"
import { useLocation } from "@docusaurus/router";
// import { useQromaCommFileSystemApi } from "../file-explorer/QromaCommFileSystemApi";
import { convertBinaryToBase64 } from "../utils";
import { IQromaCommFilesystemRxApi, useQromaCommFileSystemRxApi } from "../file-explorer/QromaCommFileSystemRxApi";


interface IQromaIoShowQromaFileUiComponentProps<T extends object, U extends object> {
  // qromaCommFileSystemApi: IQromaCommFilesystemRxApi
}

export const QromaIoShowQromaFileUiComponent = <T extends object, U extends object>(
  props: IQromaIoShowQromaFileUiComponentProps<T, U>
) => {

  const [base64Content, setBase64Content] = useState("");

  const location = useLocation();
  console.log(location);

  const hash: string = location.hash;
  const isValid = hash.startsWith("#/");

  const filePath = hash.substring(1);


  if (!isValid) {
    return <div>
      Invalid Qroma file path. Paths must start with <b>#/</b>.
    </div>
  }

  const qromaCommFileSystemApi = useQromaCommFileSystemRxApi();
  // const qromaCommFileSystemApi = props.qromaCommFileSystemApi;
  const isConnected = qromaCommFileSystemApi.connectionState.isWebSerialConnected;

  const showFileContents = async (filePath: string) => {
    console.log("SHOWING FILE CONTENTS FOR " + filePath);
    const fileContents = await qromaCommFileSystemApi.getFileContents(filePath);
    if (fileContents === undefined) {
      console.log("Unable to read file contents for " + filePath);
      return;
    }

    console.log("FILE CONTENTS");
    console.log(fileContents);
    const decoded = new TextDecoder().decode(fileContents.fileBytes);

    console.log("FILE CONTENTS");
    console.log(decoded);

    setBase64Content(convertBinaryToBase64(decoded));
  }

  const startConnection = () => {
    qromaCommFileSystemApi.init();
    console.log("qromaCommFileSystemApi - INIT CALLED");
  }

  useEffect(() => {
    const loadFileContent = async () => {
      await showFileContents(filePath);
    };
    loadFileContent();
  }, [filePath]);
  
  
  return (
    <div>
      <div>QromaIoShowQromaFileComponent!!!</div>
      <div>FILEPATH: {filePath}</div>
      {isConnected ? 
        <button onClick={() => showFileContents(filePath) }>Show contents</button> :
        <button onClick={() => startConnection() }>Start Connection!</button> 
      }
      <div>Base 64 Content</div>
      <div>{base64Content}</div>
    </div>
  )
}
