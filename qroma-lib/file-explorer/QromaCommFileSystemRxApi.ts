import { GetFileContentsResponse, ListDirContentsResponse, MkDirResponse, RmDirResponse, RmFileResponse, ReportFileDataResponse } from "../../qroma-comm-proto/file-system-commands";
import { QromaCommCommand, QromaCommResponse } from "../../qroma-comm-proto/qroma-comm";
import { crc32 } from "crc";
// import { useQromaCommWebSerial } from "../webserial/QromaCommWebSerial";
import { sleep } from "../utils";
import { IQromaConnectionState, PortRequestResult } from "../webserial/QromaWebSerial";

// @ts-ignore
import { Buffer } from 'buffer';
import { useState } from "react";
import { GetFileStatusCode } from "../../qroma-comm-proto/qroma-types";
import { IQromaCommRxHandler, useQromaCommWebSerialRx } from "../webserial/QromaCommWebSerialRx";
import { createDefaultQromaParser } from "../webserial/QromaCommParser";
import { createDownloadFileContentsRxHandler } from "./DownloadFileContentsRxHandler";


export interface IQromaCommFilesystemRxApi {
  // init: (onConnection: (success: boolean) => void) => void
  init: () => void

  listDir: (dirPath: string) => Promise<ListDirContentsResponse | undefined>
  mkDir: (dirPath: string) => Promise<MkDirResponse | undefined>
  rmDir: (dirPath: string) => Promise<RmDirResponse | undefined>

  // getFileDetails: (filePath: string) => Promise<ReportFileDataResponse | undefined>
  getFileDetailsRx: (filePath: string) => Promise<ReportFileDataResponse | undefined>
  getFileContents: (filePath: string) => Promise<GetFileContentsResponse | undefined>
  // getFileBytes: (filePath: string) => Promise<Uint8Array | undefined>
  
  writeFileContents: (filePath: string, contents: Uint8Array) => Promise<ReportFileDataResponse | undefined>
  downloadFileContents: (filePath: string) => Promise<Uint8Array | null>
  rmFile: (filePath: string) => Promise<RmFileResponse | undefined>

  connectionState: IQromaConnectionState
  unsubscribe: () => void
}


export const useQromaCommFileSystemRxApi = (): IQromaCommFilesystemRxApi => {

  console.log("STARTING QromaCommFileSystemRxApi");

  const [connectionState, setConnectionState] = useState({
    isConnected: false,
    isMonitorOn: false,
    isPortConnected: false,

    isQromaMonitoringOn: false,
    isWebSerialConnected: false,
    keepQromaMonitoringOn: false,
  } as IQromaConnectionState);

  // let _latestResponse: QromaCommResponse | undefined = undefined;

  // const clearLatestResponse = () => {
  //   _latestResponse = undefined;
  // }

  // const setLatestResponse = (message: QromaCommResponse) => {
  //   _latestResponse = message;
  // }

  // const onQromaCommResponse = (message: QromaCommResponse): boolean => {
  //   console.log("QCFSRX")
  //   console.log(message)
  //   setLatestResponse(message);
  //   return true;
  // }

  const startMonitoring = () => {
    qromaCommWebSerial.startMonitoring();
  }
  
  const onConnectionChange = (latestConnectionState: IQromaConnectionState) => {
    setConnectionState(latestConnectionState);
  }

  console.log("CALLING useQromaCommWebSerialRx()")
  // const qromaCommWebSerial = useQromaCommWebSerialRx(onQromaCommResponse, onConnectionChange);
  const qromaCommWebSerial = useQromaCommWebSerialRx(onConnectionChange);


  // const waitForResponse = async <T,>(filter: (message: QromaCommResponse) => T, timeoutInMs: number) : Promise<T | undefined> => {
  //   const expirationTime = Date.now() + timeoutInMs;
    
  //   while (Date.now() < expirationTime) {
  //     if (_latestResponse !== undefined) {
  //       const filteredResponse = filter(_latestResponse);
  //       if (filteredResponse !== undefined) {
  //         return filteredResponse;
  //       }
  //     }
  //     await sleep(25);
  //   }

  //   return;
  // }


  // const getFileDetails = async (filePath: string): Promise<ReportFileDataResponse | undefined> => {
  //   console.log("GET FILE DETAILS")
  //   const reportFileDataCommand: QromaCommCommand = {
  //     command: {
  //       oneofKind: 'fsCommand',
  //       fsCommand: {
  //         command: {
  //           oneofKind: 'reportFileDataCommand',
  //           reportFileDataCommand: {
  //             filePath,
  //           }
  //         }
  //       }
  //     }
  //   };

  //   await qromaCommWebSerial.sendQromaCommCommand(reportFileDataCommand);

  //   const result = await waitForResponse((message: QromaCommResponse) => {
  //     console.log("FILTERING");
  //     console.log(_latestResponse);

  //     if (message.response.oneofKind === 'fsResponse' &&
  //         message.response.fsResponse.response.oneofKind === 'reportFileDataResponse')
  //     {
  //       console.log("GET FILE DETAILS SUCCESS");
  //       return message.response.fsResponse.response.reportFileDataResponse;
  //     }

  //     return;
  //   }, 2000);

  //   console.log("FILE DETAILS RESULT")
  //   console.log(result)

  //   return result;
  // }


  const getFileDetailsRx = async (filePath: string): Promise<ReportFileDataResponse | undefined> => {
    console.log("GET FILE DETAILS RX")

    const reportFileDataCommand: QromaCommCommand = {
      command: {
        oneofKind: 'fsCommand',
        fsCommand: {
          command: {
            oneofKind: 'reportFileDataCommand',
            reportFileDataCommand: {
              filePath,
            }
          }
        }
      }
    };

    let rx: ReportFileDataResponse | undefined = undefined;
    let timedOut = false;
    const timeoutInMs = 2000;
    const expirationTime = Date.now() + timeoutInMs;

    const dqp = createDefaultQromaParser("getFileDetailsRx");
    const rxOnQromaCommResponse = (message: QromaCommResponse) => {
      if (message.response.oneofKind === 'fsResponse' &&
          message.response.fsResponse.response.oneofKind === 'reportFileDataResponse')
      {
        rx = message.response.fsResponse.response.reportFileDataResponse;
      }
      return true;
    };

    let rxHandler: IQromaCommRxHandler = {
      hasTimeoutOccurred: () => Date.now() > expirationTime,
      onTimeout: () => { timedOut = true; },
      onRx: (rxBuffer: Uint8Array) => {
        return dqp.parse(rxBuffer, rxOnQromaCommResponse);
      },
      isRxComplete: () => rx !== undefined,
    };

    await qromaCommWebSerial.sendQromaCommCommandRx(reportFileDataCommand, rxHandler);

    console.log("FILE DETAILS RESULT RX")
    console.log(rx)
    console.log(timedOut)

    return rx;
  }
  

  const getFileContents = async (filePath: string): Promise<GetFileContentsResponse | undefined> => {
    const getFileContentsCommand: QromaCommCommand = {
      command: {
        oneofKind: 'fsCommand',
        fsCommand: {
          command: {
            oneofKind: 'getFileContentsCommand',
            getFileContentsCommand: {
              filePath,
            }
          }
        }
      }
    };

    // clearLatestResponse();
    // await qromaCommWebSerial.sendQromaCommCommand(getFileContentsCommand);

    // const result = await waitForResponse((message: QromaCommResponse) => {
    //   console.log("FILTERING");
    //   console.log(_latestResponse);

    //   if (message.response.oneofKind === 'fsResponse' &&
    //       message.response.fsResponse.response.oneofKind === 'getFileContentsResponse')
    //   {
    //     console.log("GET FILE CONTENT SUCCESS");
    //     return message.response.fsResponse.response.getFileContentsResponse;
    //   }

    //   return;
    // }, 1000);

    // return result;

    let rx: GetFileContentsResponse | undefined = undefined;
    let timedOut = false;
    const timeoutInMs = 2000;
    const expirationTime = Date.now() + timeoutInMs;

    const dqp = createDefaultQromaParser("getFileDetailsRx");
    const rxOnQromaCommResponse = (message: QromaCommResponse) => {
      if (message.response.oneofKind === 'fsResponse' &&
          message.response.fsResponse.response.oneofKind === 'getFileContentsResponse')
      {
        rx = message.response.fsResponse.response.getFileContentsResponse;
      }
      return true;
    };

    let rxHandler: IQromaCommRxHandler = {
      hasTimeoutOccurred: () => Date.now() > expirationTime,
      onTimeout: () => { timedOut = true; },
      onRx: (rxBuffer: Uint8Array) => {
        return dqp.parse(rxBuffer, rxOnQromaCommResponse);
      },
      isRxComplete: () => rx !== undefined,
    };

    await qromaCommWebSerial.sendQromaCommCommandRx(getFileContentsCommand, rxHandler);

    console.log("GetFileContentsResponse RX")
    console.log(rx)
    console.log(timedOut)

    return rx;
  }

  // const getFileBytes = async (filePath: string): Promise<Uint8Array | undefined> => {

  //   const getFileContentsCommand: QromaCommCommand = {
  //     command: {
  //       oneofKind: 'fsCommand',
  //       fsCommand: {
  //         command: {
  //           oneofKind: 'getFileContentsCommand',
  //           getFileContentsCommand: {
  //             filePath,
  //           }
  //         }
  //       }
  //     }
  //   };

  //   // clearLatestResponse();
  //   // await qromaCommWebSerial.sendQromaCommCommand(getFileContentsCommand);

  //   // const result = await waitForResponse((message: QromaCommResponse) => {
  //   //   console.log("FILTERING");
  //   //   console.log(_latestResponse);

  //   //   if (message.response.oneofKind === 'fsResponse' &&
  //   //       message.response.fsResponse.response.oneofKind === 'getFileContentsResponse')
  //   //   {
  //   //     console.log("GET FILE CONTENT SUCCESS");
  //   //     return message.response.fsResponse.response.getFileContentsResponse;
  //   //   }

  //   //   return;
  //   // }, 1000);

  //   // return result;

  //   let rx: Uint8Array | undefined = undefined;
  //   let timedOut = false;
  //   const timeoutInMs = 2000;
  //   const expirationTime = Date.now() + timeoutInMs;

  //   const dqp = createDefaultQromaParser("getFileDetailsRx");
  //   const rxOnQromaCommResponse = (message: QromaCommResponse) => {
  //     if (message.response.oneofKind === 'fsResponse' &&
  //         message.response.fsResponse.response.oneofKind === 'reportFileDataResponse')
  //     {
  //       rx = message.response.fsResponse.response.reportFileDataResponse;
  //     }
  //     return true;
  //   };

  //   let rxHandler: IQromaCommRxHandler = {
  //     hasTimeoutOccurred: () => Date.now() > expirationTime,
  //     onTimeout: () => { timedOut = true; },
  //     onRx: (rxBuffer: Uint8Array) => {
  //       return dqp.parse(rxBuffer, rxOnQromaCommResponse);
  //     },
  //     isRxComplete: () => rx !== undefined,
  //   };

  //   await qromaCommWebSerial.sendQromaCommCommandRx(getFileContentsCommand, rxHandler);

  //   console.log("FILE DETAILS RESULT RX")
  //   console.log(rx)
  //   console.log(timedOut)

  //   return rx;
  // }

  const downloadFileContents = async (filePath: string): Promise<Uint8Array | null> => {
    // filter for init ack... on success, get number of bytes to wait for or timeout, then filter for complete... 
    // otherwise, we failed, so return null

    const fileStreamId = Math.floor(Date.now() / 1000);

    const requestFileStreamCommand: QromaCommCommand = {
      command: {
        oneofKind: 'streamCommand',
        streamCommand: {
          command: {
            oneofKind: 'initReadFileStreamCommand',
            initReadFileStreamCommand: {
              filePath,
              fileStreamId,
            }
          }
        }
      }
    };

    const rxHandler = createDownloadFileContentsRxHandler(5000);

    await qromaCommWebSerial.sendQromaCommCommandRx(requestFileStreamCommand, rxHandler);

    if (rxHandler.getDownloadStage() === 'complete-success') {
      return rxHandler.getFileBytes();

    } else {
      console.log("DOWNLOAD DIDN'T COMPLETE SUCCESSFULLY")
      console.log(rxHandler)
    }

    return null;
  }

  const rmDir = async (dirPath: string): Promise<RmDirResponse | undefined> => {
    const rmFileCommand: QromaCommCommand = {
      command: {
        oneofKind: 'fsCommand',
        fsCommand: {
          command: {
            oneofKind: 'rmDirCommand',
            rmDirCommand: {
              dirPath,
            }
          }
        }
      }
    };

    await qromaCommWebSerial.sendQromaCommCommand(rmFileCommand);

    return;
  }

  const writeFileContents = async (filePath: string, contents: Uint8Array): Promise<ReportFileDataResponse | undefined> => {
    if (contents.length < 500) {
      return await _writeFileContents(filePath, contents);
    }

    return await _streamFileContents(filePath, contents);
  }

  const _writeFileContents = async (filePath: string, contents: Uint8Array): Promise<ReportFileDataResponse | undefined> => {

    const checksum = crc32(contents);

    const writeFileContentsCommand: QromaCommCommand = {
      command: {
        oneofKind: 'fsCommand',
        fsCommand: {
          command: {
            oneofKind: 'writeFileDataCommand',
            writeFileDataCommand: {
              fileBytes: contents,
              fileData: {
                filename: filePath,
                filesize: contents.length,
                checksum,
              }
            }
          }
        }
      }
    };

    await qromaCommWebSerial.sendQromaCommCommand(writeFileContentsCommand);

    return;
  }

  const _streamFileContents = async (filePath: string, contents: Uint8Array): Promise<ReportFileDataResponse | undefined> => {

    const checksum = crc32(contents);

    const fileStreamId = Math.floor(Date.now() / 1000);

    const initWriteFileStreamCommand: QromaCommCommand = {
      command: {
        oneofKind: 'streamCommand',
        streamCommand: {
          command: {
            oneofKind: 'initWriteFileStreamCommand',
            initWriteFileStreamCommand: {
              fileStreamId,
              fileData: {
                filename: filePath,
                filesize: contents.length,
                checksum,
              }
            }
          }
        }
      }
    };

    console.log("SENDING STREAM CMD")
    clearLatestResponse();
    await qromaCommWebSerial.sendQromaCommCommand(initWriteFileStreamCommand);
    
    const initStreamResult = await waitForResponse((message: QromaCommResponse) => {
      if (message.response.oneofKind === 'streamResponse' &&
          message.response.streamResponse.response.oneofKind === 'initWriteFileStreamAckResponse')
      {
        console.log("FILTER SUCCESS");
        return message.response.streamResponse.response.initWriteFileStreamAckResponse;
      }

      return;
    }, 2000);

    console.log("ACK RESPONSE");
    console.log(initStreamResult)

    await _sendBytesStream(contents);

    const sendCompleteResult = await waitForResponse((message: QromaCommResponse) => {
      if (message.response.oneofKind === 'streamResponse' &&
          message.response.streamResponse.response.oneofKind === 'writeFileStreamCompleteResponse')
      {
        console.log("FILTER SUCCESS");
        return message.response.streamResponse.response.writeFileStreamCompleteResponse;
      }

      return;
    }, 2000);

    console.log("SEND COMPLETE RESPONSE");
    console.log(sendCompleteResult)


    return;
  }

  const _sendBytesStream = async (bytestoSend: Uint8Array) => {
    return await qromaCommWebSerial.qromaWebSerial.sendBytesInChunks(bytestoSend, 2000, 100);
  }

  const rmFile = async (filePath: string): Promise<RmFileResponse | undefined> => {
    const rmFileCommand: QromaCommCommand = {
      command: {
        oneofKind: 'fsCommand',
        fsCommand: {
          command: {
            oneofKind: 'rmFileCommand',
            rmFileCommand: {
              filePath,
            }
          }
        }
      }
    };

    console.log(rmFileCommand);
    await qromaCommWebSerial.sendQromaCommCommand(rmFileCommand);

    return;
  }

  const listDir = async (dirPath: string): Promise<ListDirContentsResponse | undefined> => {

    const fsCommand: QromaCommCommand = {
      command: {
        oneofKind: 'fsCommand',
        fsCommand: {
          command: {
            oneofKind: 'listDirContentsCommand',
            listDirContentsCommand: {
              dirPath,
              startsWithConstraint: "",
              endsWithConstraint: "",
            }
          }
        }
      }
    };

    // console.log("CALLING SF API - listDir()")

    // // wait for next message
    // clearLatestResponse();
    // await qromaCommWebSerial.sendQromaCommCommand(fsCommand);
    // // listen for latest message; if valid/expected message type, return value
    // const result = await waitForResponse((message: QromaCommResponse) => {
    //   console.log("FILTERING");
    //   console.log(_latestResponse);

    //   if (message.response.oneofKind === 'fsResponse' &&
    //       message.response.fsResponse.response.oneofKind === 'listDirContentsResponse')
    //   {
    //     console.log("FILTER SUCCESS");
    //     return message.response.fsResponse.response.listDirContentsResponse;
    //   }

    //   return;
    // }, 1000);

    // return result;


    let rx: ListDirContentsResponse | undefined = undefined;
    let timedOut = false;
    const timeoutInMs = 2000;
    const expirationTime = Date.now() + timeoutInMs;

    const dqp = createDefaultQromaParser("listDir");
    const rxOnQromaCommResponse = (message: QromaCommResponse) => {
      if (message.response.oneofKind === 'fsResponse' &&
          message.response.fsResponse.response.oneofKind === 'listDirContentsResponse')
      {
        rx = message.response.fsResponse.response.listDirContentsResponse;
      }
      return true;
    };

    let rxHandler: IQromaCommRxHandler = {
      hasTimeoutOccurred: () => Date.now() > expirationTime,
      onTimeout: () => { timedOut = true; },
      onRx: (rxBuffer: Uint8Array) => {
        return dqp.parse(rxBuffer, rxOnQromaCommResponse);
      },
      isRxComplete: () => rx !== undefined,
    };

    await qromaCommWebSerial.sendQromaCommCommandRx(fsCommand, rxHandler);

    console.log("listDir RESULT RX")
    console.log(rx)
    console.log(timedOut)

    return rx;
  }

  const mkDir = async (dirPath: string): Promise<MkDirResponse | undefined> => {
    const mkDirCommand: QromaCommCommand = {
      command: {
        oneofKind: 'fsCommand',
        fsCommand: {
          command: {
            oneofKind: 'mkDirCommand',
            mkDirCommand: {
              dirPath,
            }
          }
        }
      }
    };

    // // wait for next message
    // clearLatestResponse();
    // qromaCommWebSerial.sendQromaCommCommand(mkDirCommand);

    // const result = await waitForResponse((message: QromaCommResponse) => {
    //   console.log("FILTERING");
    //   console.log(_latestResponse);

    //   if (message.response.oneofKind === 'fsResponse' &&
    //       message.response.fsResponse.response.oneofKind === 'listDirContentsResponse')
    //   {
    //     console.log("FILTER SUCCESS");
    //     return message.response.fsResponse.response.listDirContentsResponse;
    //   }

    //   return;
    // }, 1000);

    // return result;

    let rx: MkDirResponse | undefined = undefined;
    let timedOut = false;
    const timeoutInMs = 2000;
    const expirationTime = Date.now() + timeoutInMs;

    const dqp = createDefaultQromaParser("mkDir");
    const rxOnQromaCommResponse = (message: QromaCommResponse) => {
      if (message.response.oneofKind === 'fsResponse' &&
          message.response.fsResponse.response.oneofKind === 'listDirContentsResponse')
      {
        rx = message.response.fsResponse.response.listDirContentsResponse;
      }
      return true;
    };

    let rxHandler: IQromaCommRxHandler = {
      hasTimeoutOccurred: () => Date.now() > expirationTime,
      onTimeout: () => { timedOut = true; },
      onRx: (rxBuffer: Uint8Array) => {
        return dqp.parse(rxBuffer, rxOnQromaCommResponse);
      },
      isRxComplete: () => rx !== undefined,
    };

    await qromaCommWebSerial.sendQromaCommCommandRx(mkDirCommand, rxHandler);

    console.log("mkDir RESULT RX")
    console.log(rx)
    console.log(timedOut)

    return rx;
  }


  return {
    init: startMonitoring,
    
    // getFileDetails,
    getFileDetailsRx,
    getFileContents,
    // getFileBytes,

    writeFileContents,
    downloadFileContents,
    rmFile,

    listDir,
    mkDir,
    rmDir,

    connectionState: qromaCommWebSerial.getConnectionState(),
    unsubscribe: qromaCommWebSerial.unsubscribe,
  };
}