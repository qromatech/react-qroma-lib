import React, { useState } from "react"
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

  const { qromaCommFileSystemApi } = { ...props };

  const [dirItems, setDirItems] = useState([] as DirItem[]);
  const [activeDirPath, setActiveDirPath] = useState("...");

  // useEffect(() => {
  //   return () => {
  //     console.log("UNMOUNTING")
  //     qromaCommFileSystemApi.unsubscribe();
  //   }
  // })

  console.log("RENDERING QromaCommFileExplorerUiComponent")
  
  const listDirPath = async (dirPath: string) => {
    console.log("LISTING DIR PATH")
    const dirResult = await qromaCommFileSystemApi.listDir(dirPath);
    if (dirResult && dirResult.success) {
      console.log("UPDATING DIR ITEMS")
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