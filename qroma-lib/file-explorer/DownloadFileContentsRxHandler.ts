import { crc32 } from "crc";
import { QromaCommResponse } from "../../qroma-comm-proto/qroma-comm";
import { InitReadFileStreamAckResponse, ReadFileStreamCompleteResponse } from "../../qroma-comm-proto/qroma-streams";
import { GetFileStatusCode } from "../../qroma-comm-proto/qroma-types";
import { createDefaultQromaParser } from "../webserial/QromaCommParser";
import { IQromaCommRxHandler } from "../webserial/QromaCommWebSerialRx";


type DownloadFileStage = 'awaiting-init-ack' | 'awaiting-all-bytes' | 'awaiting-msg-complete' | 
                         'complete-success' | 'complete-err';


export interface IQromaCommDownloadFileContentsRxHandler extends IQromaCommRxHandler {
  fileBytes: Uint8Array
  downloadStage: DownloadFileStage
  ackResponse: InitReadFileStreamAckResponse
  txCompleteResult: ReadFileStreamCompleteResponse
}

export const createDownloadFileContentsRxHandler = (timeoutInMs: number): IQromaCommDownloadFileContentsRxHandler => {
  
  let downloadStage: DownloadFileStage = 'awaiting-init-ack';

  let ackResponse: InitReadFileStreamAckResponse | undefined;
  let ackSuccessful = false;

  let expectedByteCount = -1;
  let allBytesReceived = false;
  let fileBytes: Uint8Array = new Uint8Array();

  let txCompleteResult: ReadFileStreamCompleteResponse | undefined;
  let txSuccessful = false;
  
  const checkForAckResult = (message: QromaCommResponse) => {
    if (message.response.oneofKind === 'streamResponse' &&
        message.response.streamResponse.response.oneofKind === 'initReadFileStreamAckResponse')
    {
      console.log("ACK RX- initReadFileStreamAckResponse");
      
      downloadStage = 'awaiting-all-bytes';
      ackResponse = message.response.streamResponse.response.initReadFileStreamAckResponse;
      ackSuccessful = ackResponse.fileStatus === GetFileStatusCode.GFSC_FILE_EXISTS;

      if (ackResponse.fileStatus !== GetFileStatusCode.GFSC_FILE_EXISTS) {
        console.log("UNSUCCESSFUL ACK RESPONSE");
        console.log(ackResponse);
        downloadStage = 'complete-err';
        return;
      }

      expectedByteCount = ackResponse.fileData.filesize;
      downloadStage = 'awaiting-all-bytes';
    }
  };

  const receiveBytes = (newBytes: Uint8Array) => {
    const remainingBytesExpected = expectedByteCount - fileBytes.length;
    const bytesToAdd = newBytes.slice(0, remainingBytesExpected);
    const bytesRemaining = newBytes.slice(remainingBytesExpected);

    fileBytes = new Uint8Array([...fileBytes, ...bytesToAdd]);

    if (fileBytes.length >= expectedByteCount) {
      downloadStage = 'awaiting-msg-complete';
      allBytesReceived = true;
    }

    return bytesRemaining;
  }

  const checkForCompleteResult = (message: QromaCommResponse) => {  
    if (message.response.oneofKind === 'streamResponse' &&
        message.response.streamResponse.response.oneofKind === 'readFileStreamCompleteResponse')
    {
      console.log("COMPLETE RX - readFileStreamCompleteResponse");
      
      txCompleteResult = message.response.streamResponse.response.readFileStreamCompleteResponse;
      txSuccessful = txCompleteResult.success;

      if (!txSuccessful) {
        console.log("UNSUCCESSFUL TX COMPLETE RESPONSE");
        console.log(txCompleteResult);
        downloadStage = 'complete-err';
        return;
      }

      const downloadedBytesChecksum = crc32(fileBytes);
      if (downloadedBytesChecksum !== ackResponse.fileData.checksum) {
        console.log("TX CHECKSUM MISMATCH");
        console.log(ackResponse)
        console.log(downloadedBytesChecksum);
        console.log(fileBytes);
        downloadStage = 'complete-err';
        return;
      }

      downloadStage = 'complete-success';
    }
  }


  const expirationTime = Date.now() + timeoutInMs;
  let timedOut = false;
  const dqp = createDefaultQromaParser();

  let rxHandler: IQromaCommRxHandler = {
    hasTimeoutOccurred: () => Date.now() > expirationTime,
    onTimeout: () => { timedOut = true; },
    onRx: (rxBuffer: Uint8Array) => {
      switch (downloadStage) {
        case 'awaiting-init-ack':
          return dqp.parse(rxBuffer, checkForAckResult);
        case 'awaiting-all-bytes':
          return receiveBytes(rxBuffer);
        case 'awaiting-msg-complete':
          return dqp.parse(rxBuffer, checkForCompleteResult);

      }
    },
    isRxComplete: () => downloadStage === 'complete-success' || downloadStage === 'complete-err',
  };
  
  return rxHandler;




  

  // const ackResult = await waitForResponse((message: QromaCommResponse) => {
  //   console.log("FILTERING");
  //   console.log(_latestResponse);
  
  //   if (message.response.oneofKind === 'streamResponse' &&
  //       message.response.streamResponse.response.oneofKind === 'initReadFileStreamAckResponse')
  //   {
  //     console.log("ACK - initReadFileStreamAckResponse");
  //     return message.response.streamResponse.response.initReadFileStreamAckResponse;
  //   }
  
  //   return;
  // }, 1000);
  
  // if (ackResult?.fileStatus !== GetFileStatusCode.GFSC_FILE_EXISTS) {
  //   console.log("UNSUCCESSFUL ACK RESULT");
  //   console.log(ackResult);
  //   return null;
  // }
  
  // console.log("RECEIVE FILE CONTENTS STAGE")
  // const fileBytes = qromaCommWebSerial.qromaWebSerial.sendBytes
  
  // clearLatestResponse();
  // const completeResult = await waitForResponse((message: QromaCommResponse) => {
  //   console.log("FILTERING FOR readFileStreamCompleteResponse");
  //   console.log(_latestResponse);
  
  //   if (message.response.oneofKind === 'streamResponse' &&
  //       message.response.streamResponse.response.oneofKind === 'readFileStreamCompleteResponse')
  //   {
  //     console.log("COMPLETE - readFileStreamCompleteResponse");
  //     return message.response.streamResponse.response.readFileStreamCompleteResponse;
  //   }
  
  //   return;
  // }, 1000);
  
  // if (completeResult?.success !== true) {
  //   console.log("UNSUCCESSFUL COMPLETE RESULT");
  //   console.log(completeResult);
  //   return null;
  // }
}
