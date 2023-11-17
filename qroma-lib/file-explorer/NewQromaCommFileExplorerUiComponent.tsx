import React, { useContext, useState } from "react"
import { IQromaCommFilesystemApi } from "./QromaCommFileSystemApi";
import { DirItem, DirItemType } from "../../qroma-comm-proto/file-system-commands";
import { QromaPageAppContext } from "../webserial/QromaPageAppContext";

// // @ts-ignore
// import { Buffer } from 'buffer';


interface INewQromaCommFileExplorerUiComponentProps {
  // qromaCommFileSystemApi: IQromaCommFilesystemApi
}



export const NewQromaCommFileExplorerUiComponent = (props: INewQromaCommFileExplorerUiComponentProps) => {
  
  // const [isConnected, setIsConnected] = useState(false);

  const [dirItems, setDirItems] = useState([] as DirItem[]);
  const [activeDirPath, setActiveDirPath] = useState("...");

  const qromaApp = useContext(QromaPageAppContext);
  const qcFileExplorer = qromaApp.qromaCommFileExplorer;

  
  const DirUiComponent = ({dirPath, dirItem}: {dirPath: string, dirItem: DirItem}) => {
    const separator = dirPath.endsWith("/") ? "" : "/";
    const itemPath = dirPath + separator + dirItem.name;
    console.log("DIRPATH ITEM - " + itemPath);

    return (
      <li>
        <button onClick={() => listDirPath(itemPath)}>D: {dirItem.name}</button>
        <button onClick={() => rmDir(itemPath) }>Delete</button>
        <button onClick={() => createFileInDirPath(itemPath) }>Create File</button>
      </li>
    )
  }

  const OpenContentsLink = ({itemPath}: {itemPath: string}) => {
    console.log(itemPath)
    const itemUrl = "./qroma-io/showQromaFile/#" + itemPath;
    return (
      <a href={itemUrl} target="_blank" rel="noopener noreferrer">
        {itemPath}
      </a>
    )
  }

  const FileUiComponent = ({dirPath, dirItem}: {dirPath: string, dirItem: DirItem}) => {
    console.log("FILEPATH");
    console.log(dirPath);
    console.log(dirItem.name);

    const separator = dirPath.endsWith("/") ? "" : "/";
    const itemPath = dirPath + separator + dirItem.name;
    console.log("FILEPATH ITEM - " + itemPath);

    return (
      <li>
        <button onClick={() => listDirPath("/" + dirItem.name)}>F: {dirItem.name}</button>
        <button onClick={() => rmFile(itemPath) }>Delete</button>
        <button onClick={() => showFileContents(itemPath) }>Show</button>
        <OpenContentsLink 
          itemPath={itemPath}
          />
      </li>
    )
  }
  

  const listDirPath = async (dirPath: string) => {
    const dirResult = await qcFileExplorer.listDir(dirPath);
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
      await qcFileExplorer.mkDir(prefix + dirPath);
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

    await qcFileExplorer.writeFileContents(filePath, encoded);
  }

  const createFileInDirPath = async (dirPath: string) => {
    const fileName = prompt("Enter file name");
    if (fileName === null) {  
      return;
    }

    const fileContent = prompt("Enter file content");
    if (fileContent === null) {  
      return;
    }

    const separator = dirPath.endsWith("/") ? "" : "/";
    const filePath = dirPath + separator + fileName;

    console.log("CREATING FILE");
    console.log(filePath);

    const encoder = new TextEncoder();
    const encoded = encoder.encode(fileContent);

    await qcFileExplorer.writeFileContents(filePath, encoded);
  }

  // const readFile = async () => {
  //   const filePath = prompt("Enter file path");
  //   if (filePath === null) {  
  //     return;
  //   }
    
  //   const fileContents = await props.qromaCommFileSystemApi.getFileContents(filePath);
  //   if (fileContents === undefined) {
  //     console.log("Unable to read file contents for " + filePath);
  //     return;
  //   }

  //   console.log("FILE CONTENTS");
  //   console.log(fileContents);
  //   const decoded = new TextDecoder().decode(fileContents.fileBytes);

  //   console.log("FILE CONTENTS");
  //   console.log(decoded);
  // }

  const rmFile = async (filePath: string) => {
    await qcFileExplorer.rmFile(filePath);
  }

  const showFileContents = async (filePath: string) => {
    const fileContents = await qcFileExplorer.getFileContents(filePath);
    if (fileContents === undefined) {
      console.log("Unable to read file contents for " + filePath);
      return;
    }

    console.log("FILE CONTENTS");
    console.log(fileContents);
    const decoded = new TextDecoder().decode(fileContents.fileBytes);

    console.log("FILE CONTENTS");
    console.log(decoded);

    alert(decoded);
  }

  const rmDir = async (dirPath: string) => {
    await qcFileExplorer.rmDir(dirPath);
  }

  const onConnection = (success: boolean) => {
    console.log("EXPLORER ON CONNECTION");
    console.log(success);
    // if (success) {
    //   setIsConnected(true);
    // }
  }

  const startMonitoring = async () => {
    qcFileExplorer.init(onConnection);
    console.log("INIT CALLED");
  }

  const isConnected = qromaApp.qromaPageSerial.isConnected;
  
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
      {/* <button onClick={() => readFile() }>READ FILE</button> */}
      <div>
        DIR PATH: {activeDirPath}
        <ul>
          {dirItems.map(x => {
            if (x.dirItemType === DirItemType.DIT_DIR) {
              return (
                <DirUiComponent
                  dirPath={activeDirPath}
                  dirItem={x}
                  key={x.name}
                  />
              )
            } else {
              return (
                <FileUiComponent
                  dirPath={activeDirPath}
                  dirItem={x}
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