import React from "react";
import { DirItem } from "../../qroma-comm-proto/file-system-commands";
import { IQromaCommFilesystemRxApi, useQromaCommFileSystemRxApi } from "./QromaCommFileSystemRxApi";
import { NavToDirLink } from "./NavToDirLink";


interface IDirUiComponentProps {
  dirPath: string
  dirItem: DirItem
  qromaCommFileSystemApi: IQromaCommFilesystemRxApi
}


export const DirUiComponent = (props: IDirUiComponentProps) => {
  const dirPath = props.dirPath;
  const dirItem = props.dirItem;

  const separator = dirPath.endsWith("/") ? "" : "/";
  const itemPath = dirPath + separator + dirItem.name;
  console.log("DIRPATH ITEM - " + itemPath);

  // const qromaCommFileSystemApi = useQromaCommFileSystemRxApi();

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

    await props.qromaCommFileSystemApi.writeFileContents(filePath, encoded);
  }

  return (
    <>
      <li>
        d - {itemPath}
        <button onClick={() => createFileInDirPath(itemPath) }>Create File</button>
        <NavToDirLink 
          navToDirPath={itemPath}
          />
      </li>
    </>
  )
}