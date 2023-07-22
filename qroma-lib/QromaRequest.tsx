// import { MessageType } from "@protobuf-ts/runtime"
// import React from "react"


// interface IQromaRequestProps<T extends object> {
//   messageType: MessageType<T>
// }


// export const QromaRequest = <T extends object>(props: IQromaRequestProps<T>) => {
//   console.log("FIELDS");
//   console.log(props.messageType.fields);
//   console.log("FIELDS DONE");

//   return (
//     <div>
//       Qroma Request
//       {
//         props.messageType.fields.map(f => (
//           <QromaField
//             field={f}
//             key={f.jsonName}
//             />
//         ))
//       }
//       {/* <ul>
//         <li>{props.messageType.fields[0].name}</li>
//         <li>{props.messageType.fields[0].kind}</li>
//         <li>{props.messageType.fields[0].no}</li>
//       </ul> */}
//     </div>
//   )
// }