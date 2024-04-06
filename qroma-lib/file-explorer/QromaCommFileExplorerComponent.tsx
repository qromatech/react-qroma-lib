import React from "react";
import { QromaCommFileExplorerUiComponent } from "./QromaCommFileExplorerUiComponent";
import { useQromaCommFileSystemRxApi } from "./QromaCommFileSystemRxApi";


interface IQromaCommFileExplorerComponentProps { }


export const QromaCommFileExplorerComponent = (props: IQromaCommFileExplorerComponentProps) => {

  console.log("RE-RENDERING QromaCommFileExplorerComponent")
  const qromaCommFileSystemApi = useQromaCommFileSystemRxApi();

  return (
    <QromaCommFileExplorerUiComponent
      qromaCommFileSystemApi={qromaCommFileSystemApi}
      />
  )
}
