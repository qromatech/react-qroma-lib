import { Buffer } from 'buffer';
import { QromaCommResponse } from '../../../qroma-comm-proto/qroma-comm';
import { IQromaPageSerial } from '../QromaPageSerial';


export interface IQromaCommRxInputs {
  onQromaCommResponse: (message: QromaCommResponse) => void;
  qromaPageSerial: IQromaPageSerial
}

export interface IQromaCommRx {
  unsubscribe: () => void
}


export const createQromaCommRx = (inputs: IQromaCommRxInputs): IQromaCommRx => {
  let rxBuffer = new Uint8Array();

  const setRxBuffer = (update: Uint8Array) => {
    rxBuffer = update;
  }

  const _onData = (newData: Uint8Array) => {
    console.log("QromaCommWebSerial - onData");
    console.log(newData);

    let currentRxBuffer = new Uint8Array([...rxBuffer, ...newData]);

    let firstNewLineIndex = 0;

    while (firstNewLineIndex !== -1) {

      let firstNewLineIndex = currentRxBuffer.findIndex(x => x === 10);

      if (firstNewLineIndex === -1) {
        setRxBuffer(currentRxBuffer);
        return;
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

        console.log("QromaCommWebSerial - onData has response");
        console.log(response);

        inputs.onQromaCommResponse(response);

      } catch (e) {
        // console.log("CAUGHT ERROR");
        // console.log(e);
      }
    }
    setRxBuffer(currentRxBuffer);
  }

  const qpsListener = {
    onData: _onData,
    onPortRequestResult: (prr) => { }
  };

  const unsubscribe = inputs.qromaPageSerial.listen(qpsListener);

  return {
    unsubscribe,
  };
}
