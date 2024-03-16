import { QromaCoreCommand } from "../qroma-comm-proto/qroma-core";
import { IQromaCoreWebSerial } from "./webserial/QromaCoreWebSerial"


interface IQromaCoreRequestFormProps {
  qromaWebSerial: IQromaCoreWebSerial
}


export const QromaCoreRequestForm = (props: IQromaCoreRequestFormProps) => {
  const qromaCoreWebSerial = props.qromaWebSerial;

  return (
    <>
      <div>
        <button onClick={() => {
          const command: QromaCoreCommand = {
            command: {
              oneofKind: 'getQromaCoreConfig',
              getQromaCoreConfig: { ignoreThis: 1 },
            }
          };
          qromaCoreWebSerial.sendQromaCoreCommand(command);
        }}>Get Core config</button>
      </div>
      <div>
        <button onClick={() => {
          const command: QromaCoreCommand = {
            command: {
              oneofKind: 'getFirmwareDetails',
              getFirmwareDetails: { ignoreThis: 1 },
            }
          };
          qromaCoreWebSerial.sendQromaCoreCommand(command);
        }}>Get firmware details</button>
      </div>
    </>
  )
}
