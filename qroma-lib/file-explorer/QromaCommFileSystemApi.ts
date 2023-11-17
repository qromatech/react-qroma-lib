import { useContext, useEffect, useState } from "react";
import { GetFileContentsResponse, ListDirContentsResponse, MkDirResponse, RmDirResponse, RmFileResponse, ReportFileDataResponse } from "../../qroma-comm-proto/file-system-commands";
import { QromaCommCommand, QromaCommResponse } from "../../qroma-comm-proto/qroma-comm";
import { crc32 } from "crc";
import { IUseQromaCommWebSerialInputs, useQromaCommWebSerial } from "../webserial/QromaCommWebSerial";
import { sleep } from "../utils";
import { PortRequestResult } from "../webserial/QromaWebSerial";

// @ts-ignore
import { Buffer } from 'buffer';
import { QromaPageSerialContext } from "../webserial/QromaPageSerialContext";
import { createQromaCommTx } from "../webserial/processors/QromaCommTx";
import { IQromaPageSerial } from "../webserial/QromaPageSerial";
import { IQromaCommRxInputs, createQromaCommRx } from "../webserial/processors/QromaCommRx";


export interface IQromaCommFilesystemApi {
  init: (onConnection: (success: boolean) => void) => void

  listDir: (dirPath: string) => Promise<ListDirContentsResponse | undefined>
  mkDir: (dirPath: string) => Promise<MkDirResponse | undefined>
  rmDir: (dirPath: string) => Promise<RmDirResponse | undefined>

  getFileDetails: (filePath: string) => Promise<ReportFileDataResponse | undefined>
  getFileContents: (filePath: string) => Promise<GetFileContentsResponse | undefined>
  writeFileContents: (filePath: string, contents: Uint8Array) => Promise<ReportFileDataResponse | undefined>
  rmFile: (filePath: string) => Promise<RmFileResponse | undefined>

  qromaPageSerial: IQromaPageSerial
}


export const QromaCommFileSystemApi = (props: {qromaPageSerial: IQromaPageSerial}): IQromaCommFilesystemApi => {

  console.log("STARTING QromaCommFileSystemApi");

  // const [latestResponse, setLatestResponse] = useState(undefined as QromaCommResponse | undefined);
  // let latestResponse: QromaCommResponse | undefined = undefined;
  let latestResponse: any = undefined;
  let latestResponseLastSet: Date = new Date();
  let latestResponseLastCleared: Date = new Date();
  // let _onConnection: ((success: boolean) => void) | undefined = undefined; 

  const clearLatestResponse = (reason: string) => {
    console.log("CLEARING LATES RESPONSE - " + reason)
    // latestResponse = undefined;
    latestResponse = "notset"
    latestResponseLastCleared = new Date();
    console.log(latestResponseLastCleared);
  }

  const setLatestResponse = (message: QromaCommResponse) => {
    console.log("SETING LATEST RESPONSE");
    console.log(message);
    latestResponse = message;
    console.log(latestResponse)
    latestResponseLastSet = new Date();
    console.log(latestResponseLastSet);
  }

  // const clearLatestResponse = () => {
  //   setLatestResponse(undefined);
  // }

  const onQromaCommResponse = (message: QromaCommResponse) => {
    console.log("QromaCommFileSystemApi - onQromaCommResponse()");
    console.log(message);
    setLatestResponse(message);
    console.log(latestResponse)
  }

  
  const startMonitoring = (onConnection: (success: boolean) => void) => {
    // _onConnection = onConnection;

    if (qromaCommWebSerial) {
      setTimeout(() => {
        props.qromaPageSerial.startMonitoring();
      }, 0);
    }
  }

  const onPortRequestResult = (requestResult: PortRequestResult) => {
    // if (_onConnection !== undefined) {
    //   _onConnection(requestResult.success);
    // }
  }
      

  const qromaCommWebSerialInputs: IUseQromaCommWebSerialInputs = {
    onQromaCommResponse,
    // onConnect: () => { console.log("QFSApi - SERIAL CONNECTED"); },
    // onDisconnect: () => { console.log("QFSApi - SERIAL DISCONNECTED"); },
    onPortRequestResult,
  }

  // const qromaCommWebSerial = useQromaCommWebSerial(qromaCommWebSerialInputs);
  console.log("QFSApi - useQromaCommWebSerial()");
  console.log(qromaCommWebSerialInputs);
  // const qromaCommWebSerial = useQromaCommWebSerial(qromaCommWebSerialInputs);

  // const qromaPageSerial = useContext(QromaPageSerialContext);
  const qromaCommWebSerial = createQromaCommTx({
    qromaPageSerial: props.qromaPageSerial,
  });

  const qromaCommRxInputs: IQromaCommRxInputs = {
    onQromaCommResponse,
    qromaPageSerial: props.qromaPageSerial,
  };
  const qromaCommRx = createQromaCommRx(qromaCommRxInputs);


  const waitForResponse = async <T,>(filter: (message: QromaCommResponse) => T, timeoutInMs: number) : Promise<T | undefined> => {
    console.log("waitForResponse");
    const expirationTime = Date.now() + timeoutInMs;
    console.log(expirationTime)
    console.log(filter)
    console.log(latestResponseLastSet);
    console.log(latestResponseLastCleared);
    
    while (Date.now() < expirationTime) {
      console.log("TICKx")
      console.log(latestResponse)
      console.log(latestResponseLastSet);
      console.log(latestResponseLastCleared);
      // if (latestResponse !== undefined) {
      if (latestResponse !== "notset") {
        console.log("LATEST RESPONSE");
        console.log(latestResponse)
        const filteredResponse = filter(latestResponse);
        if (filteredResponse !== undefined) {
          return filteredResponse;
        }
      }
      await sleep(100);
    }

    console.log(`waitForResponse() expired [${timeoutInMs} ms timeout]`);

    return;
  }


  const getFileDetails = async (filePath: string): Promise<ReportFileDataResponse | undefined> => {
    const reportFileDataCommand: QromaCommCommand = {
      command: {
        oneofKind: 'fsCommand',
        fsCommand: {
          command: {
            oneofKind: 'reportFileDataCommand',
            reportFileDataCommand: {
              filename: filePath,
            }
          }
        }
      }
    };

    await qromaCommWebSerial.sendQromaCommCommand(reportFileDataCommand);

    return;
  }
  

  const getFileContents = async (filePath: string): Promise<GetFileContentsResponse | undefined> => {
    const reportFileDataCommand: QromaCommCommand = {
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

    clearLatestResponse("getFileContents");
    await qromaCommWebSerial.sendQromaCommCommand(reportFileDataCommand);

    const result = await waitForResponse((message: QromaCommResponse) => {
      console.log("FILTERING");
      console.log(latestResponse);

      if (message.response.oneofKind === 'fsResponse' &&
          message.response.fsResponse.response.oneofKind === 'getFileContentsResponse')
      {
        console.log("GET FILE CONTENT SUCCESS");
        return message.response.fsResponse.response.getFileContentsResponse;
      }

      return;
    }, 1000);

    return result;
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

    // wait for next message
    clearLatestResponse("listDir");
    await qromaCommWebSerial.sendQromaCommCommand(fsCommand);

    // listen for latest message; if valid/expected message type, return value
    const result = await waitForResponse((message: QromaCommResponse) => {
      console.log("FILTERING");
      console.log(message);

      if (message.response.oneofKind === 'fsResponse' &&
          message.response.fsResponse.response.oneofKind === 'listDirContentsResponse')
      {
        console.log("FILTER SUCCESS");
        return message.response.fsResponse.response.listDirContentsResponse;
      }

      return;
    }, 1000);

    return result;
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

    // wait for next message
    clearLatestResponse("mkDir");
    qromaCommWebSerial.sendQromaCommCommand(mkDirCommand);

    const result = await waitForResponse((message: QromaCommResponse) => {
      console.log("FILTERING");
      console.log(latestResponse);

      if (message.response.oneofKind === 'fsResponse' &&
          message.response.fsResponse.response.oneofKind === 'listDirContentsResponse')
      {
        console.log("FILTER SUCCESS");
        return message.response.fsResponse.response.listDirContentsResponse;
      }

      return;
    }, 1000);

    return result;
  }

  useEffect(() => {
    return () => {
      console.log("UNMUONTING QROMACOMMFILESYSTEMAPI")
    }
  });


  return {
    init: startMonitoring,
    
    getFileDetails,
    getFileContents,
    writeFileContents,
    rmFile,

    listDir,
    mkDir,
    rmDir,

    qromaPageSerial: props.qromaPageSerial,
  };
}