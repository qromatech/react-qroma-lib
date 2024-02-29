import React, { useEffect } from "react";
import { QromaCommFileExplorerUiComponent } from "./QromaCommFileExplorerUiComponent";
import { useQromaCommFileSystemRxApi } from "./QromaCommFileSystemRxApi";
// import { QromaCommFileSystemApi } from "./QromaCommFileSystemApi";


export const QromaCommFileExplorerComponent = () => {

  console.log("CALLING useQromaCommFileSystemRxApi()")

  // const qromaCommFileSystemApi = QromaCommFileSystemApi();
  const qromaCommFileSystemApi = useQromaCommFileSystemRxApi();
  // let qromaCommFileSystemApi = useQromaCommFileSystemRxApi();

  // useEffect(() => {
  //   return () => {
  //     console.log("UNMOUNTING")
  //     qromaCommFileSystemApi.unsubscribe();
  //   }
  // })

  return (
    <QromaCommFileExplorerUiComponent
      qromaCommFileSystemApi={qromaCommFileSystemApi}
      />
  )
}
