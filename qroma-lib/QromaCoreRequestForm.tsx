import { QromaCoreCommand, QromaCoreNoArgCommands } from "../qroma-comm-proto/qroma-core";
import { IQromaCoreWebSerial } from "./webserial/QromaCoreWebSerial"


interface IQromaCoreRequestFormProps {
  qromaWebSerial: IQromaCoreWebSerial
}


export const QromaCoreRequestForm = (props: IQromaCoreRequestFormProps) => {
  const qromaCoreWebSerial = props.qromaWebSerial;

  const getQromaCoreConfig = () => {
    const command: QromaCoreCommand = {
      command: {
        oneofKind: 'noArgCommand',
        noArgCommand: QromaCoreNoArgCommands.Qc_Nac_GetQromaCoreConfig,
      }
    };
    qromaCoreWebSerial.sendQromaCoreCommand(command);
  }

  const getFirmwareDetails = () => {
    const command: QromaCoreCommand = {
      command: {
        oneofKind: 'noArgCommand',
        noArgCommand: QromaCoreNoArgCommands.Qc_Nac_GetQromaCoreFirmwareDetails,
      }
    };
    qromaCoreWebSerial.sendQromaCoreCommand(command);
  }

  // const showSavedCoreConfig = async () => {
  //   const command: QromaCoreCommand = {
  //     command: {
  //       oneofKind: 'getFirmwareDetails',
  //       getFirmwareDetails: { ignoreThis: 1 },
  //     }
  //   };
  //   qromaCoreWebSerial.sendQromaCoreCommand(command);
  //   console.log("DID IT")
  // }

  const enableLogging = async () => {
    const command: QromaCoreCommand = {
      command: {
        oneofKind: 'noArgCommand',
        noArgCommand: QromaCoreNoArgCommands.Qc_Nac_EnableAllLogging,
      }
    };
    qromaCoreWebSerial.sendQromaCoreCommand(command);
  }

  const disableLogging = async () => {
    const command: QromaCoreCommand = {
      command: {
        oneofKind: 'noArgCommand',
        noArgCommand: QromaCoreNoArgCommands.Qc_Nac_DisableLogging,
      }
    };
    qromaCoreWebSerial.sendQromaCoreCommand(command);
  }

  const enableHeartbeat = async () => {
    const command: QromaCoreCommand = {
      command: {
        oneofKind: 'noArgCommand',
        noArgCommand: QromaCoreNoArgCommands.Qc_Nac_EnableCoreHeartbeat,
      }
    };
    qromaCoreWebSerial.sendQromaCoreCommand(command);
  }

  const disableHeartbeat = async () => {
    const command: QromaCoreCommand = {
      command: {
        oneofKind: 'noArgCommand',
        noArgCommand: QromaCoreNoArgCommands.Qc_Nac_DisableCoreHeartbeat,
      }
    };
    qromaCoreWebSerial.sendQromaCoreCommand(command);
  }


  return (
    <>
      <div>
        <button onClick={() => { getQromaCoreConfig(); }}>Get Core config</button>
      </div>
      
      <div>
        <button onClick={() => { getFirmwareDetails(); }}>Get firmware details</button>
      </div>

      <div>
        <button onClick={() => { enableHeartbeat(); }}>Enable heartbeat</button>
        <button onClick={() => { disableHeartbeat(); }}>Disable heartbeat</button>
      </div>

      <div>
        <button onClick={() => { enableLogging(); }}>Enable logging</button>
        <button onClick={() => { disableLogging(); }}>Disable logging</button>
      </div>

    </>
  )
}
