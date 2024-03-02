import React from "react"
import { useLocation } from "@docusaurus/router";
// import { useQromaCommFileSystemApi } from "../file-explorer/QromaCommFileSystemApi";
import { convertBase64ToBinary } from "../utils";
import { IQromaCommFilesystemRxApi, useQromaCommFileSystemRxApi } from "../file-explorer/QromaCommFileSystemRxApi";


interface IQromaIoAddQromaFileComponentProps {
  qromaCommFileSystemApi: IQromaCommFilesystemRxApi
}

export const QromaIoAddQromaFileComponent = (
  props: IQromaIoAddQromaFileComponentProps
) => {
  
  const location = useLocation();
  // const qromaCommFileSystemApi = useQromaCommFileSystemRxApi();
  const qromaCommFileSystemApi = props.qromaCommFileSystemApi;

  const hash: string = location.hash;

  const regex = /#(.*)!(.*)/gm;
  const regex_exec_result = regex.exec(hash)
  
  const filePath = regex_exec_result[1];
  const contentAsB64 = regex_exec_result[2];

  if (filePath === undefined || contentAsB64 === undefined) {
    return <div>
      Invalid Qroma file path or content. Paths must start with <b>#/</b> and end with <b>!</b>. Content should then follow, encoded in Base 64.
    </div>
  }

  const isConnected = qromaCommFileSystemApi.connectionState.isWebSerialConnected;
  const isPortConnected = qromaCommFileSystemApi.connectionState.isWebSerialConnected;

  const sendRequest = async () => {
    const fileContent = convertBase64ToBinary(contentAsB64);
    await qromaCommFileSystemApi.writeFileContents(filePath, fileContent);
  }

  const startConnection = () => {
    qromaCommFileSystemApi.init();
  }
  
  return (
    <>
      <div>QromaIoAddQromaFileComponent!!!</div>
      <div>
        Going to write bytes below from Base64 to <b>{filePath}</b>
      </div>
      <div>
        Serial Connected? { isConnected ? "Yes" : "No" } / { isPortConnected ? "Yes" : "No" }
      </div>
      {isConnected ? 
        <button onClick={() => sendRequest() }>Add File</button> :
        <button onClick={() => startConnection() }>Start Connection!</button> 
      }
      <div>
        {contentAsB64}
      </div>
    </>
  )
}
