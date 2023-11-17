import { Buffer } from 'buffer';
import { QromaCommCommand } from '../../../qroma-comm-proto/qroma-comm';
import { IQromaPageSerial } from '../QromaPageSerial';


export interface IQromaCommTxInputs {
  qromaPageSerial: IQromaPageSerial
  // sendQromaCommCommand: (qcCommand: QromaCommCommand) => void
}

export interface IQromaCommTx {
  sendQromaCommCommand: (qcCommand: QromaCommCommand) => void
}


export const createQromaCommTx = (inputs: IQromaCommTxInputs): IQromaCommTx => {

  const sendQromaCommCommand = async (qcCommand: QromaCommCommand) => {
    if (!inputs.qromaPageSerial.isConnected) {
      console.log("sendQromaCommCommand - CAN'T SEND COMMAND - NO CONNECTION");
      console.log(qcCommand);
      return;
    }

    const messageBytes = QromaCommCommand.toBinary(qcCommand);
    
    console.log(messageBytes);
    const requestB64 = Buffer.from(messageBytes).toString('base64') + "\n";
    console.log(requestB64);
    console.log(requestB64.length);

    await inputs.qromaPageSerial.sendString(requestB64);
  }

  return {
    sendQromaCommCommand,
  }
}
