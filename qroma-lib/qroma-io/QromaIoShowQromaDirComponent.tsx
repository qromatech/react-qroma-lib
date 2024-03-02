import React, { useContext, useEffect, useState } from "react"
import { useLocation } from "@docusaurus/router";
// import { useQromaCommFileSystemApi } from "../file-explorer/QromaCommFileSystemApi";
import { DirItem, DirItemType, ListDirContentsResponse } from "../../qroma-comm-proto/file-system-commands";
import { DirUiComponent } from "../file-explorer/DirUiComponent";
import { FileUiComponent } from "../file-explorer/FileUiComponent";
import { useQromaCommFileSystemRxApi } from "../file-explorer/QromaCommFileSystemRxApi";


interface IQromaIoShowQromaDirComponentProps<T extends object, U extends object> {
  // qromaCommFileSystemApi: IQromaCommFilesystemRxApi
}


export const QromaIoShowQromaDirComponent = <T extends object, U extends object>(
  props: IQromaIoShowQromaDirComponentProps<T, U>
) => {

  const [dirItems, setDirItems] = useState([] as DirItem[]);
  const [activeDirPath, setActiveDirPath] = useState("...");

  const location = useLocation();
  console.log(location);

  const hash: string = location.hash;
  const isValid = hash.startsWith("#/");

  const dirPath = hash.substring(1);


  if (!isValid) {
    return <div>
      Invalid Qroma file path. Paths must start with <b>#/</b>.
    </div>
  }

  const qromaCommFileSystemApi = useQromaCommFileSystemRxApi();
  // const qromaCommFileSystemApi = props.qromaCommFileSystemApi;
  const isConnected = qromaCommFileSystemApi.connectionState.isWebSerialConnected;

  console.log("DIRECTORY CONTENTS")
  console.log(dirItems);

  
  const showDirContents = async (dirPath: string) => {
    console.log("SHOWING DIR CONTENTS FOR " + dirPath);

    const dirResult = await qromaCommFileSystemApi.listDir(dirPath);
    if (dirResult && dirResult.success) {
      setDirItems(dirResult.dirItems);
      setActiveDirPath(dirResult.dirPath);
    }
    console.log("DIR RESULT");
    console.log(dirResult);
  }

  const startConnection = () => {
    qromaCommFileSystemApi.init();
    console.log("qromaCommFileSystemApi - INIT CALLED FROM SHOW QROMA DIR");
  }

  useEffect(() => {
    const loadDirContent = async () => {
      await showDirContents(dirPath);
    };
    loadDirContent();
  }, [dirPath]);

  
  return (
    <div>
      <div>QromaIoShowQromaDirComponent!!!</div>
      <div>DIRPATH: {dirPath}</div>
      {isConnected ? 
        <button onClick={() => showDirContents(dirPath) }>Show contents</button> :
        <button onClick={() => startConnection() }>Start Connection!</button> 
      }
      <div>Dir Contents [{dirPath}]</div>
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
    </div>
  )
}
