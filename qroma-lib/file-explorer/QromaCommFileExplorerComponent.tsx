import React, { useContext } from "react";
import { QromaCommFileExplorerUiComponent } from "./QromaCommFileExplorerUiComponent";
import { QromaCommFileSystemApi } from "./QromaCommFileSystemApi";
import { QromaPageSerialContext } from "../webserial/QromaPageSerialContext";
import { NewQromaCommFileExplorerUiComponent } from "./NewQromaCommFileExplorerUiComponent";


export const QromaCommFileExplorerComponent = () => {

  console.log("RENDERING QromaCommFileExplorerComponent")
  const qromaPageSerial = useContext(QromaPageSerialContext);
  const qromaCommFileSystemApi = QromaCommFileSystemApi({qromaPageSerial});

  return (
    // <QromaCommFileExplorerUiComponent
    //   qromaCommFileSystemApi={qromaCommFileSystemApi}
    //   />
    <NewQromaCommFileExplorerUiComponent
      />
  )
}
