// import React, { useState } from "react"
// import { FieldInfo, IMessageType, JsonObject } from "@protobuf-ts/runtime"
// import { MessageAllFieldsInputComponent } from "./MessageAllFieldsInputComponent"
// import { MessageFieldsForInputComponent } from "./MessageFieldsForInputComponent"
// import { OneofGroup } from "./defs"
// import { MessageSingleFieldInputComponent } from "./MessageSingleFieldInputComponent"
// // import { MessageAllFieldsDetailsComponent } from "./MessageAllFieldsDetailsComponent";


// interface IMessageInputComponentProps<T extends object> {
//   // requestMessageType: MessageType<T>
//   messageType: IMessageType<T>
//   // messageName: string
//   // typeName: string
//   messageValue: T
//   fields: readonly FieldInfo[]
//   // onScalarValueChange: <T>(field: FieldInfo, newValue: T) => void
//   // onOneofChange: (oneof: OneofGroup, oneofSelection: string) => void
//   // onEnumChange: (enumDef: any, enumStrValue: string, enumIntValue: number) => void
//   updateParentOneofValue: (fieldName: string, value: any) => void
//   updateParentMemberValue: (fieldName: string, value: any) => void
// }


// export const MessageInputComponent = <T extends object>(props: IMessageInputComponentProps<T>) => {

//   // const [requestObjectData, setRequestObjectData] = useState(
//   //   props.messageType.toJson(props.messageType.create()) as JsonObject);

//   console.log("MessageInputComponent RENDER")
//   console.log(props.messageValue)


//   // const onMessageInputChange = (field: FieldInfo, newValue: any) => {
//   //   console.log("onMessageInputChange - New value!!! ");
//   //   console.log(field);
//   //   console.log(newValue);

//   //   // const valueToSet = field.kind === 'enum' ? field.no : newValue;

//   //   // const newRequestObjectData = JSON.parse(JSON.stringify(requestObjectData));
//   //   // console.log(requestObjectData);
//   //   // newRequestObjectData[field.name] = valueToSet;
//   //   // setRequestObjectData(newRequestObjectData);
//   //   // console.log(newRequestObjectData);

//   //   // props.onChange(field, newRequestObjectData);

//   //   // props.onScalarValueChange(field, newValue);
//   // }

//   const onOneofFieldSelectionChange = (oneof: OneofGroup, oneofSelection: string) => {
//     console.log("MessageInputComponent - onOneof")
//     console.log(oneof);
//     console.log(oneofSelection);
//     // console.log(newValue);

//     const updatedMessage = props.messageType.fromBinary(props.messageType.toBinary(props.messageValue));

//     const newOneofField = oneof.oneofFields.find(f => f.name === oneofSelection);
//     if (newOneofField.kind === "message") {
//       const newOneofValue = newOneofField.T().create();
//       const updatedOneofValue = {
//         oneofKind: oneofSelection,
//         [oneofSelection]: newOneofValue
//       }
  
//       console.log("UPDATD MESSAGE");
//       console.log(updatedMessage);
  
//       props.updateParentOneofValue(oneof.oneofFieldName, updatedOneofValue);

//     } else if (newOneofField.kind === "enum") {
//       const enumInfo = newOneofField.T();
//       const enumName = enumInfo[0];
//       const enumValues = enumInfo[1];
      
//       console.log("NEW ONE OF ENUM")
//       console.log(enumInfo);

//       let firstEnumChoice = undefined;

//       for (var r in enumValues) {
//         console.log(r)
//         if (firstEnumChoice === undefined) {
//           firstEnumChoice = parseInt(r);
//         }
//       }

//       const updatedOneofValue = {
//         oneofKind: oneofSelection,
//         [oneofSelection]: firstEnumChoice,
//       }

//       console.log("UPDATED MSG FOR ENUM")
//       console.log(updatedOneofValue)
//       props.updateParentOneofValue(oneof.oneofFieldName, updatedOneofValue)
//       // for (const e in enumValues) {
//       //   newOneofValue = e;
//       // }
  
//     } else if (newOneofField.kind === 'scalar') {
//       const scalarType = newOneofField.T;
//       const newOneofValue = 0;
//     }
//     // }
//     // updatedMessage[oneof.oneofFieldName] = {
//     //   oneofKind: oneofSelection,
//     //   oneofSelection: newOneofValue
//     // }

//   }

//   // const onEnumChange = (enumDef: any, enumStrValue: string, enumIntValue: number) => {
//   //   console.log("MESSAGE INPUT ON-ENUM-CHANGE")
//   //   console.log(enumDef);

//   //   // props.onEnumChange(enumDef, enumStrValue, enumIntValue);
//   // }

//   // const clearParentFieldValue = (fieldName: string) => {
//   //   console.log("IN clearParentFieldValue");
//   //   console.log(fieldName);
//   //   // console.log(requestObjectData);
//   // //   if (requestObjectData !== null) {
//   // //     const {[fieldName]: _, ...clearedObject} = requestObjectData;
//   // //     setRequestObjectData(clearedObject);
//   // //     console.log(clearedObject);
//   // //   }
//   // }

//   const updateParentMemberValue = (fieldName: string, value: any) => {
//     console.log("MESSAGE INPUT COMPONNT - updateParentMemberValue")
//     props.updateParentMemberValue(fieldName, value)
//   }

  
//   return (
//     <div>
//       [{props.messageType.typeName}] ++++
//       {/* <MessageAllFieldsInputComponent
//         messageTypeName={props.typeName}
//         fields={props.fields}
//         onChange={onMessageInputChange}
//         onOneofChange={onOneofChange}
//         onEnumChange={onEnumChange}
//         clearParentFieldValue={clearParentFieldValue}
//         /> */}
//       {/* <MessageInputComponent
//         messageTypeName={props.typeName}
//         fields={props.fields}
//         onChange={onMessageInputChange}
//         onOneofChange={onOneofChange}
//         onEnumChange={onEnumChange}
//         clearParentFieldValue={clearParentFieldValue}
//         /> */}
//       <MessageFieldsForInputComponent
//         messageTypeName={props.messageType.typeName}
//         messageValue={props.messageValue}
//         fields={props.fields}
//         // onChange={onMessageInputChange}
//         updateParentOneofValue={onOneofFieldSelectionChange}
//         updateParentMemberValue={updateParentMemberValue}
//         // updateParentOneofValue={props.updateParentOneofValue}
//         // onEnumChange={onEnumChange}
//         />
//     </div>

//   )
// }