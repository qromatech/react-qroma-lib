import { Buffer } from 'buffer';
import { QromaCommResponse } from "../../qroma-comm-proto/qroma-comm";


export interface IQromaCommParser {
  // onQromaCommResponse returns true to indicate that it's OK to keep parsing QromaComm messages; 
  // returns false to stop parsing QromaComm and let other parsing occur
  parse: (rxBuffer: Uint8Array, onQromaCommResponse: (message: QromaCommResponse) => boolean) => Uint8Array
}


export const createDefaultQromaParser = (name: string): IQromaCommParser => {
  
  const parse = (
    rxBuffer: Uint8Array, 
    onQromaCommResponse: (message: QromaCommResponse) => boolean
  ): Uint8Array => {

    let currentRxBuffer = new Uint8Array(rxBuffer);
    let firstNewLineIndex = 0;
    let keepParsing = true;
    
    while (firstNewLineIndex !== -1 && keepParsing) {

      let firstNewLineIndex = currentRxBuffer.findIndex(x => x === 10);

      if (firstNewLineIndex === -1) {
        // setRxBuffer(currentRxBuffer);
        // return;
        // console.log("NO NEW LINE IN BUFFER")
        // console.log(currentRxBuffer)
        return currentRxBuffer;
      }

      if (firstNewLineIndex === 0) {
        currentRxBuffer = currentRxBuffer.slice(1, currentRxBuffer.length);
        continue;
      }

      try {
        const b64Bytes = currentRxBuffer.slice(0, firstNewLineIndex);
        currentRxBuffer = currentRxBuffer.slice(firstNewLineIndex + 1, currentRxBuffer.length);

        const b64String = new TextDecoder().decode(b64Bytes);
        console.log("QCP - DEV RESPONSE: " + b64String);
        console.log("QCP - DEV REMAINING: " + new TextDecoder().decode(currentRxBuffer))

        try {
            
          const messageBytes = Buffer.from(b64String, 'base64');
          // console.log("MSG BYTES - " + name)
          // console.log(messageBytes)
          const response = QromaCommResponse.fromBinary(messageBytes);
          console.log("RESPONSE FROM BYTES - " + name)
          // console.log(b64String)
          console.log(response)

          console.log("DefaultQromaParser - parse() has QC response");
          console.log(response);

          firstNewLineIndex = 0;
          keepParsing = onQromaCommResponse(response);
          if (!keepParsing) {
            console.log("QROMA COMM PARSING CANCELED")
          }
        } catch (e) {
          // console.log("PARSE ERR")
          // console.log(e)
        }

      } catch (e) {
        // console.log("CAUGHT ERROR");
        // console.log(e);
      }
    }

    return currentRxBuffer;
  }

  return {
    parse,
  }
}