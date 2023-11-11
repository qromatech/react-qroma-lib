import React, { useState } from "react"
import { MessageType } from "@protobuf-ts/runtime";
import { IQromaAppWebSerial } from "../webserial/QromaAppWebSerial";
import { useLocation } from "@docusaurus/router";
import { QromaCommResponse } from "../../qroma-comm-proto/qroma-comm";
import { PortRequestResult } from "../webserial/QromaWebSerial";
import { IUseQromaCommWebSerialInputs, useQromaCommWebSerial } from "../webserial/QromaCommWebSerial";
import { QromaCommFileSystemApi } from "../file-explorer/QromaCommFileSystemApi";
import { QromaIoShowQromaFileUiComponent } from "./QromaIoShowQromaFileUiComponent";


interface IQromaIoShowQromaFileComponentProps<T extends object, U extends object> {
  responseMessageType: MessageType<U>
  qromaWebSerial: IQromaAppWebSerial<T>
}

export const QromaIoShowQromaFileComponent = <T extends object, U extends object>(
  props: IQromaIoShowQromaFileComponentProps<T, U>
) => {

  const qromaCommFileSystemApi = QromaCommFileSystemApi();

  return (
    <QromaIoShowQromaFileUiComponent
      qromaCommFileSystemApi={qromaCommFileSystemApi}
      />
  )
}
