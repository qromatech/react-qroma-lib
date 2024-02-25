import { QromaCommResponse } from "../../qroma-comm-proto/qroma-comm";


export interface IQromaCommParser {

}


export const createDefaultQromaParser = (): IQromaCommParser => {
  
  const parse = (
    currentRxBuffer: Uint8Array, 
    onQromaCommResponse: (message: QromaCommResponse) => void
  ): Uint8Array => {

    const returnBuffer = new Uint8Array(currentRxBuffer);

    let firstNewLineIndex = 0;
    while (firstNewLineIndex !== -1) {

      let firstNewLineIndex = currentRxBuffer.findIndex(x => x === 10);

      if (firstNewLineIndex === -1) {
        // setRxBuffer(currentRxBuffer);
        // return;
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
        console.log("RESPONSE: " + b64String);
        const messageBytes = Buffer.from(b64String, 'base64');
        const response = QromaCommResponse.fromBinary(messageBytes);

        console.log("DefaultQromaParser - parse() has response");
        console.log(response);

        onQromaCommResponse(response);

      } catch (e) {
        // console.log("CAUGHT ERROR");
        // console.log(e);
      }
    }

  }

  return {

  }
}