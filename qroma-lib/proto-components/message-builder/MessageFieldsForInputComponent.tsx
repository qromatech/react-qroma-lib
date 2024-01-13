// import React from "react";
// import { FieldInfo } from "@protobuf-ts/runtime";
// import { MessageSingleFieldInputComponent } from "./MessageSingleFieldInputComponent";
// import { MessageOneofInputComponent } from "./MessageOneofInputComponent";
// import { EnumItem, OneofGroup } from "./defs";



// interface IMessageFieldsForInputComponent {
//   messageTypeName: string
//   messageValue: any
//   fields: readonly FieldInfo[]
//   // onOneofFieldSelectionChange: (oneofGroup: OneofGroup, subOneofSelection: string) => void
//   updateParentOneofValue: (oneof: OneofGroup, value: any) => void
//   updateParentMemberValue: (fieldName: string, value: any) => void
// }


// export const MessageFieldsForInputComponent = (props: IMessageFieldsForInputComponent) => {

//   const fields = props.fields;
  
//   const oneofFields = fields.filter(f => f.oneof);
//   const nonOneofFields = fields.filter(f => !f.oneof);
//   const oneofMap = new Map<string, FieldInfo[]>();

//   for (var f of oneofFields) {
//     const oneof = f.oneof!;
//     if (oneofMap.has(oneof)) {
//       oneofMap.get(oneof)!.push(f)
//     } else {
//       oneofMap.set(oneof, [f]);
//     }
//   }

//   console.log("ONE OF GROUPS");
//   console.log(oneofFields)
//   const oneofGroups = [] as OneofGroup[];
//   for (let [k, v] of oneofMap) {
//     console.log(k);
//     oneofGroups.push({
//       parentGroupField: oneofFields.find(f => f.oneof === k)!,
//       oneofFieldName: k,
//       oneofFields: v,
//       // messageBuilderFn: () => f
//     });
//   }

//   const activeOneOfGroups = new Map<string, string>();
//   oneofGroups.forEach(oog => {
//     activeOneOfGroups.set(oog.oneofFieldName, oog.oneofFields[0].name);
//   });

//   const onChange = (field: FieldInfo, newValue: any) => {
//     console.log("MessageFieldsForInputComponent CHANGE")
//     // props.onChange(field, newValue)
//   }

//   const onMemberValueChange = (field: FieldInfo, newValue: any) => {
//     console.log("ON MEMBER VALUE CHANGE");
//     console.log(field)
//     console.log(newValue)

//     props.updateParentMemberValue(field.name, newValue)
//     // props.updateParentObject(field.name, newValue)
//     // props.onEnumChange(enumItem, enumStrValue, enumIntValue);
//   }

//   return (
//     <div>
//       =====
//       <ul>
//         {
//           oneofGroups.map(oog => (
//             <MessageOneofInputComponent
//               parentObject={props.messageValue}
//               oneofGroup={oog}
//               oneofName={oog.oneofFieldName}
//               oneofFields={oog.oneofFields}
//               onOneofFieldSelectionChange={props.updateParentOneofValue}
//               onMemberValueChange={onMemberValueChange}
//               key={oog.oneofFieldName}
//             />
//           ))
//         }
//       </ul>
// ######
//       <ul>
//         {nonOneofFields.map(f => {

//           return (
//             <MessageSingleFieldInputComponent
//               messageValue={props.messageValue}
//               field={f}
//               onChange={onChange}
//               key={f.name}
//               />
//           )
//         }
//         )}
//       </ul>
//     </div>
//   )
// }