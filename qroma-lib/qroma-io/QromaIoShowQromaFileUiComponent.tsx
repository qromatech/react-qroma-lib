import React, { useState } from "react"
import { useLocation } from "@docusaurus/router";
import { IQromaCommFilesystemApi } from "../file-explorer/QromaCommFileSystemApi";
import { convertBinaryToBase64 } from "../utils";


interface IQromaIoShowQromaFileUiComponentProps<T extends object, U extends object> {
  qromaCommFileSystemApi: IQromaCommFilesystemApi
}

export const QromaIoShowQromaFileUiComponent = <T extends object, U extends object>(
  props: IQromaIoShowQromaFileUiComponentProps<T, U>
) => {

  const [isConnected, setIsConnected] = useState(false);
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

    console.log("FILE CONTENTS");
    console.log(fileContents);
    const decoded = new TextDecoder().decode(fileContents.fileBytes);

    console.log("FILE CONTENTS");
    console.log(decoded);

    setBase64Content(convertBinaryToBase64(decoded));

    alert(decoded);
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
      <div>Base 64 Content</div>
      <div>{base64Content}</div>
    </div>
  )
}
