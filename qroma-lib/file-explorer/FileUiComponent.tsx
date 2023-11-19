import React from "react";
import { DirItem } from "../../qroma-comm-proto/file-system-commands";
import { ShowQromaFileLink } from "./ShowQromaFileLink";
import { useQromaCommFileSystemApi } from "./QromaCommFileSystemApi";


interface IFileUiComponentProps {
  dirPath: string
  dirItem: DirItem
}


export const FileUiComponent = (props: IFileUiComponentProps) => {
  const dirPath = props.dirPath;
  const dirItem = props.dirItem;

  console.log("FILEPATH");
  console.log(dirPath);
  console.log(dirItem.name);

  const separator = dirPath.endsWith("/") ? "" : "/";
  const itemPath = dirPath + separator + dirItem.name;
  console.log("FILEPATH ITEM - " + itemPath);

  const qromaCommFileSystemApi = useQromaCommFileSystemApi();

  const showFileContents = async (filePath: string) => {
    const fileContents = await qromaCommFileSystemApi.getFileContents(filePath);
    if (fileContents === undefined) {
      console.log("Unable to read file contents for " + filePath);
      return;
    }

    const decoded = new TextDecoder().decode(fileContents.fileBytes);

    alert(decoded);
  }

  const rmFile = async (filePath: string) => {
    await qromaCommFileSystemApi.rmFile(filePath);
  }


  return (
    <li>
      f - {itemPath}
      <button onClick={() => rmFile(itemPath) }>Delete</button>
      <button onClick={() => showFileContents(itemPath) }>Show</button>
      <ShowQromaFileLink 
        itemPath={itemPath}
        />
    </li>
  )
}