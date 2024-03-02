import React, { ChangeEvent, useEffect, useState } from "react"
import { useQromaCommFileSystemRxApi } from "./QromaCommFileSystemRxApi";

// // @ts-ignore
// import { Buffer } from 'buffer';


interface IQromaCommFileUploadUiComponentProps { }



export const QromaCommFileUploadUiComponent = (props: IQromaCommFileUploadUiComponentProps) => {

  const qromaCommFileSystemApi = useQromaCommFileSystemRxApi();

  const [fileData, setFileData] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const [uploadingDescription, setUploadingDescription] = useState("Not uploading");

  useEffect(() => {
    return () => {
      console.log("UNMOUNTING")
      qromaCommFileSystemApi.unsubscribe();
    }
  })
  

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as ArrayBuffer;
      const byteArray = new Uint8Array(data);
      setFileData(byteArray);
    };

    reader.readAsArrayBuffer(file);
    setFileName(file.name);
  };

  const doFileUpload = async () => {
    if (fileData !== null) {
      const uploadPath = "/" + fileName;
      setUploadingDescription("Yes uploading now")

      const result = await qromaCommFileSystemApi.writeFileContents(uploadPath, fileData);

      console.log("FILE UPLOAD");
      console.log(uploadPath);
      console.log(fileData);
      console.log(result);

      setUploadingDescription("Upload complete")
    }
  }

  const startMonitoring = async () => {
    qromaCommFileSystemApi.init();
  }

  const isConnected = qromaCommFileSystemApi.connectionState.isWebSerialConnected;

  
  if (!isConnected) {
    return (
      <div>
        <button onClick={() => startMonitoring() }>START UPLOADER</button>
      </div>
    )
  }

  return (
    <div>
      <div>QromaCommFileUploadComponent - {isConnected ? "CONNECTED" : "NOT CONNECTED"}</div>
      <div>
        <input type="file" onChange={handleFileChange} />
      </div>
      <div>
        <button onClick={() => doFileUpload() } disabled={fileData === null}>UPLOAD FILE</button>
        UPLOADING STATUS: {uploadingDescription}
      </div>
    </div>
  )
}
