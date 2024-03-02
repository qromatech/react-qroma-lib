import { Buffer } from 'buffer';
import { crc32 } from "crc";
import { QromaCommResponse } from "../../qroma-comm-proto/qroma-comm";
import { InitReadFileStreamAckResponse, ReadFileStreamCompleteResponse } from "../../qroma-comm-proto/qroma-streams";
import { GetFileStatusCode } from "../../qroma-comm-proto/qroma-types";
import { createDefaultQromaParser } from "../webserial/QromaCommParser";
import { IQromaCommRxHandler } from "../webserial/QromaCommWebSerialRx";
import { concatenateUint8Arrays } from '../utils';


type DownloadFileStage = 'awaiting-init-ack' | 'awaiting-all-bytes' | 'awaiting-msg-complete' | 
                         'complete-success' | 'complete-err';


export interface IQromaCommDownloadFileContentsRxHandler extends IQromaCommRxHandler {
  getFileBytes: () => Uint8Array
  getDownloadStage: () => DownloadFileStage
  getAckResponse: () => InitReadFileStreamAckResponse
  getTxCompleteResult: () => ReadFileStreamCompleteResponse
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
  
  const checkForAckResult = (message: QromaCommResponse): boolean => {
    console.log("IN DFC RX");
    console.log(message)
    if (message.response.oneofKind === 'streamResponse' &&
        message.response.streamResponse.response.oneofKind === 'initReadFileStreamAckResponse')
    {
      console.log("ACK RX - initReadFileStreamAckResponse");
      
      downloadStage = 'awaiting-all-bytes';
      ackResponse = message.response.streamResponse.response.initReadFileStreamAckResponse;
      ackSuccessful = ackResponse.fileStatus === GetFileStatusCode.GFSC_FILE_EXISTS;

      if (ackResponse.fileStatus !== GetFileStatusCode.GFSC_FILE_EXISTS) {
        console.log("UNSUCCESSFUL ACK RESPONSE");
        console.log(ackResponse);
        downloadStage = 'complete-err';
      }

      expectedByteCount = ackResponse.fileData.filesize;
      downloadStage = 'awaiting-all-bytes';

      console.log("CHECK FOR ACK RESULT DONE")
      return false;
    }

    return true;
  };

  const receiveBytes = (newBytes: Uint8Array) => {
    const remainingBytesExpected = expectedByteCount - fileBytes.length;
    const bytesToAdd = newBytes.slice(0, remainingBytesExpected);
    const bytesRemaining = newBytes.slice(remainingBytesExpected);

    // fileBytes = new Uint8Array([...fileBytes, ...bytesToAdd]);
    fileBytes = concatenateUint8Arrays(fileBytes, bytesToAdd);
    console.log("TOTAL FILE BYTES COUNT: " + fileBytes.length)

    if (fileBytes.length >= expectedByteCount) {
      downloadStage = 'awaiting-msg-complete';
      allBytesReceived = true;
      console.log("ALL FILE BYTES RECEIVED: " + fileBytes.length)
      console.log(bytesRemaining)
    }

    return bytesRemaining;
  }

  const checkForCompleteResult = (message: QromaCommResponse): boolean => {
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

    return true;
  }


  const expirationTime = Date.now() + timeoutInMs;
  const dqp = createDefaultQromaParser("downloadRx");
  console.log("CREATING DEFAULT QROMA PARSER")

  let rxHandler: IQromaCommDownloadFileContentsRxHandler = {
    hasTimeoutOccurred: () => Date.now() > expirationTime,
    onTimeout: () => { console.log("IQromaCommDownloadFileContentsRxHandler timed out") },
    onRx: (rxBuffer: Uint8Array) => {
      console.log('xyz');
      try {
        console.log('abc');
        console.log("IQromaCommDownloadFileContentsRxHandler - onRx!!!()")
        console.log("IQromaCommDownloadFileContentsRxHandler - onRx2()", downloadStage, rxBuffer)
        console.log("#4")
        console.log("IQromaCommDownloadFileContentsRxHandler - onRx3()a")

        console.log(downloadStage)
        switch (downloadStage) {
          case 'awaiting-init-ack':
            console.log("start to handle init ack check")
            return dqp.parse(rxBuffer, checkForAckResult);
          case 'awaiting-all-bytes':
            return receiveBytes(rxBuffer);
          case 'awaiting-msg-complete':
            return dqp.parse(rxBuffer, checkForCompleteResult);
          default:
            console.log("UNEXPECTED DOWNLOAD STAGE");
            console.log(downloadStage);
            return new Uint8Array();
        }
      } catch (e) {
        console.log("ON RX ERROR")
        console.log(e)
      }
      
      return new Uint8Array();
    },
    isRxComplete: () => downloadStage === 'complete-success' || downloadStage === 'complete-err',

    getFileBytes: () => fileBytes,
    getDownloadStage: () => downloadStage,
    getAckResponse: () => ackResponse,
    getTxCompleteResult: () => txCompleteResult,
  };
  
  return rxHandler;
}



  

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
// }
