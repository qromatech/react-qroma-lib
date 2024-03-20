import React from "react";
import { DirItem } from "../../qroma-comm-proto/file-system-commands";
import { ShowQromaFileLink } from "./ShowQromaFileLink";
import { IQromaCommFilesystemRxApi, useQromaCommFileSystemRxApi } from "./QromaCommFileSystemRxApi";


interface IFileUiComponentProps {
  dirPath: string
  dirItem: DirItem
  qromaCommFileSystemApi: IQromaCommFilesystemRxApi
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

  // const qromaCommFileSystemApi = useQromaCommFileSystemRxApi();
  const qromaCommFileSystemApi = props.qromaCommFileSystemApi;

  const showFileContents = async (filePath: string) => {
    const fileContents = await props.qromaCommFileSystemApi.getFileContents(filePath);
    if (fileContents === undefined) {
      console.log("Unable to read file contents for " + filePath);
      return;
    }

    const decoded = new TextDecoder().decode(fileContents.fileBytes);

    alert(decoded);
  }

  const showFileDetails = async (filePath: string) => {
    const fileDetails = await qromaCommFileSystemApi.getFileDetailsRx(filePath);
    if (fileDetails === undefined) {
      console.log("Unable to read file details for " + filePath);
      return;
    }

    alert("File: " + fileDetails.fileData.filename +
          "\n\nSize: " + fileDetails.fileData.filesize + " bytes" +
          "\n\nChecksum: " + fileDetails.fileData.checksum);
  }

  const rmFile = async (filePath: string) => {
    await qromaCommFileSystemApi.rmFile(filePath);
  }


  const doFileDownload = async (filePath) => {
    console.log("DOWNLOAD " + filePath);

    const fileBytes = await qromaCommFileSystemApi.downloadFileContents(filePath);
    if (fileBytes === null) {
      console.log("doFileDownload() failed for " + filePath);
      return;
    }

    const lastSlashIndex = filePath.lastIndexOf('/');
    const fileNameWithExtension = lastSlashIndex !== -1 ? filePath.slice(lastSlashIndex + 1) : filePath;

    console.log(fileNameWithExtension)

    // const fileBytes = await qromaCommFileSystemApi.getFileBytes(filePath);
    // if (fileBytes === undefined) {
    //   console.log("Unable to read file contents for " + filePath);
    //   return;
    // }

    const blob = new Blob([fileBytes], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileNameWithExtension;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }


  return (
    <li>
      f - {itemPath}
      <button onClick={() => rmFile(itemPath) }>Delete</button>
      <button onClick={() => showFileContents(itemPath) }>Show</button>
      <button onClick={() => showFileDetails(itemPath) }>Details</button>
      <button onClick={() => doFileDownload(itemPath) }>Download</button>
      <ShowQromaFileLink 
        itemPath={itemPath}
        />
    </li>
  )
}