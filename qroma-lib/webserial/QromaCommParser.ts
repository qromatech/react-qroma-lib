import { Buffer } from 'buffer';
import { QromaCommResponse } from "../../qroma-comm-proto/qroma-comm";


export interface IQromaCommParser {
  parse: (rxBuffer: Uint8Array, onQromaCommResponse: (message: QromaCommResponse) => void) => Uint8Array
}


export const createDefaultQromaParser = (): IQromaCommParser => {
  
  const parse = (
    rxBuffer: Uint8Array, 
    onQromaCommResponse: (message: QromaCommResponse) => void
  ): Uint8Array => {

    let currentRxBuffer = new Uint8Array(rxBuffer);
    let firstNewLineIndex = 0;
    
    while (firstNewLineIndex !== -1) {

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
        currentRxBuffer = currentRxBuffer.slice(firstNewLineIndex, currentRxBuffer.length);

        const b64String = new TextDecoder().decode(b64Bytes);
        // console.log("QCP - RESPONSE: " + b64String);
        try {
            
          const messageBytes = Buffer.from(b64String, 'base64');
          // console.log("MSG BYTES")
          // console.log(messageBytes)
          const response = QromaCommResponse.fromBinary(messageBytes);
          // console.log("RESPONSE FROM BYTES")
          // console.log(response)

          // console.log("DefaultQromaParser - parse() has QC response");
          // console.log(response);

          onQromaCommResponse(response);
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