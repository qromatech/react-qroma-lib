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

  const showFileDetails = async (filePath: string) => {
    const fileDetails = await qromaCommFileSystemApi.getFileDetails(filePath);
    if (fileDetails === undefined) {
      console.log("Unable to read file details for " + filePath);
      return;
    }

    const filesize = fileDetails.fileData.filesize;

    alert("File: " + fileDetails.fileData.filename +
          "\n\nSize: " + fileDetails.fileData.filesize + " bytes" +
          "\n\nChecksum: " + fileDetails.fileData.checksum);
  }


  const rmFile = async (filePath: string) => {
    await qromaCommFileSystemApi.rmFile(filePath);
  }


  return (
    <li>
      f - {itemPath}
      <button onClick={() => rmFile(itemPath) }>Delete</button>
      <button onClick={() => showFileContents(itemPath) }>Show</button>
      <button onClick={() => showFileDetails(itemPath) }>Details</button>
      <ShowQromaFileLink 
        itemPath={itemPath}
        />
    </li>
  )
}