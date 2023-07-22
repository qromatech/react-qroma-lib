// // import React from "react"
// // import { QromaSiteIo } from "./models/QromaSiteIo"
// // import { MessageForm } from "./MessageForm"


// export const QromaSiteIoComponent = ({qromaSiteIo} : {qromaSiteIo: QromaSiteIo}) => {
//   return (
//     <div>
//       QromaSiteIo
//       <div>Requests
//         {qromaSiteIo.requests.map(r => (
//           <MessageForm
//             messageType={r.pbjsType}
//             />
//         ))}
//       </div>
//       <div>Responses
//         {qromaSiteIo.responses.map(r => (
//           <div>{r.pbjsType.name}</div>
//         ))}
//       </div>
//       <div>Updates
//         {qromaSiteIo.updates.map(r => (
//           <div>{r.pbjsType.name}</div>
//         ))}
//       </div>
//     </div>
//   )
// }