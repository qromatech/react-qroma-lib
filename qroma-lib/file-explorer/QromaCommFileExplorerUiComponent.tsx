import React, { ChangeEvent, useState } from "react"
// import { useQromaCommFileSystemApi } from "./QromaCommFileSystemApi";
import { DirItem, DirItemType } from "../../qroma-comm-proto/file-system-commands";
import { FileUiComponent } from "./FileUiComponent";
import { DirUiComponent } from "./DirUiComponent";
import { IQromaCommFilesystemRxApi, useQromaCommFileSystemRxApi } from "./QromaCommFileSystemRxApi";

// // @ts-ignore
// import { Buffer } from 'buffer';


interface IQromaCommFileExplorerUiComponentProps {
  qromaCommFileSystemApi: IQromaCommFilesystemRxApi
}



export const QromaCommFileExplorerUiComponent = (props: IQromaCommFileExplorerUiComponentProps) => {

  // const qromaCommFileSystemApi = useQromaCommFileSystemRxApi();
  const qromaCommFileSystemApi = props.qromaCommFileSystemApi;

  const [dirItems, setDirItems] = useState([] as DirItem[]);
  const [activeDirPath, setActiveDirPath] = useState("...");

  const [fileData, setFileData] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);


  const listDirPath = async (dirPath: string) => {
    const dirResult = await qromaCommFileSystemApi.listDir(dirPath);
    if (dirResult && dirResult.success) {
      setDirItems(dirResult.dirItems);
      setActiveDirPath(dirResult.dirPath);
    }
    console.log("DIR RESULT");
    console.log(dirResult);
  }

  const createDir = async () => {
    const dirPath = prompt("Enter directory name");
    if (dirPath !== null) {  
      const prefix = dirPath.startsWith("/") ? "" : "/";
      await qromaCommFileSystemApi.mkDir(prefix + dirPath);
    }
  }

  const createFile = async () => {
    const fileName = prompt("Enter file path");
    if (fileName === null) {  
      return;
    }

    const fileContent = prompt("Enter file content");
    if (fileContent === null) {  
      return;
    }

    const separator = activeDirPath.endsWith("/") ? "" : "/";
    const filePath = activeDirPath + separator + fileName;

    const encoder = new TextEncoder();
    const encoded = encoder.encode(fileContent);

    await qromaCommFileSystemApi.writeFileContents(filePath, encoded);
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as ArrayBuffer;
      const byteArray = new Uint8Array(data);
      setFileData(byteArray);
    };

    reader.readAsArrayBuffer(file);
    setFileName(file.name);
  };

  const doFileUpload = async () => {
    if (fileData !== null) {
      const uploadPath = "/" + fileName;

      const result = await qromaCommFileSystemApi.writeFileContents(uploadPath, fileData);

      console.log("FILE UPLOAD");
      console.log(uploadPath);
      console.log(fileData);
      console.log(result);
    }
  }

  const startMonitoring = async () => {
    qromaCommFileSystemApi.init();
  }

  const isConnected = qromaCommFileSystemApi.connectionState.isWebSerialConnected;

  
  if (!isConnected) {
    return (
      <div>
        <button onClick={() => startMonitoring() }>START EXPLORER</button>
      </div>
    )
  }

  return (
    <div>
      <div>QromaCommFileExplorerUiComponent2 - {isConnected ? "CONNECTED" : "NOT CONNECTED"}</div>
      <button onClick={() => listDirPath("/") }>LIST ROOT DIR</button>
      <button onClick={() => createDir() }>CREATE DIR</button>
      <button onClick={() => createFile() }>CREATE FILE</button>
      <input type="file" onChange={handleFileChange} />
      <button onClick={() => doFileUpload() } disabled={fileData === null}>UPLOAD FILE</button>
      
      <div>
        DIR PATH: {activeDirPath}
        <ul>
          {dirItems.map(x => {
            if (x.dirItemType === DirItemType.DIT_DIR) {
              return (
                <DirUiComponent
                  dirPath={activeDirPath}
                  dirItem={x}
                  qromaCommFileSystemApi={qromaCommFileSystemApi}
                  key={x.name}
                  />
              )
            } else {
              return (
                <FileUiComponent
                  dirPath={activeDirPath}
                  dirItem={x}
                  qromaCommFileSystemApi={qromaCommFileSystemApi}
                  key={x.name}
                  />
              ) 
            }
          })}
        </ul>
      </div>
    </div>
  )
}