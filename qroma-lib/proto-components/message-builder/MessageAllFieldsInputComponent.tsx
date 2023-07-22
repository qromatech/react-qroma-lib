import React from "react";
import { FieldInfo } from "@protobuf-ts/runtime";
import { MessageSingleFieldInputComponent } from "./MessageSingleFieldInputComponent";
import { MessageOneofInputComponent } from "./MessageOneofInputComponent";



export interface OneofGroup {
  parentGroupField: FieldInfo
  oneofFieldName: string
  oneofFields: FieldInfo[]
}

interface IMessageAllFieldsInputsComponentProps {
  messageTypeName: string
  fields: readonly FieldInfo[]
  onChange: <T>(field: FieldInfo, newValue: T) => void
  onOneofChange: <T>(oneofGroup: OneofGroup, subOneofSelection: string, newValue: T) => void
  clearParentFieldValue: (fieldName: string) => void
}


export const MessageAllFieldsInputComponent = (props: IMessageAllFieldsInputsComponentProps) => {

  const fields = props.fields;
  
  const oneofFields = fields.filter(f => f.oneof);
  const nonOneofFields = fields.filter(f => !f.oneof);
  const oneofMap = new Map<string, FieldInfo[]>();

  for (var f of oneofFields) {
    const oneof = f.oneof!;
    if (oneofMap.has(oneof)) {
      oneofMap.get(oneof)!.push(f)
    } else {
      oneofMap.set(oneof, [f]);
    }
  }

  console.log("ONE OF GROUPS");
  console.log(oneofFields)
  const oneofGroups = [] as OneofGroup[];
  for (let [k, v] of oneofMap) {
    console.log(k);
    oneofGroups.push({
      parentGroupField: oneofFields.find(f => f.oneof === k)!,
      oneofFieldName: k,
      oneofFields: v,
    });
  }

  const activeOneOfGroups = new Map<string, string>();
  oneofGroups.forEach(oog => {
    activeOneOfGroups.set(oog.oneofFieldName, oog.oneofFields[0].name);
  });

  // const subMessageOnChange = (subField: FieldInfo, newValue: any) => {
  //   // if (oneofGroups.find(x => x.oneofFieldName === subField.name)) {
  //   //   console.log("DANGER-FIX ME");
  //   //   return;
  //   // }

  //   console.log("SUBMESSAGE CHANGE: ");
  //   console.log(subField.name);
  //   console.log(newValue);
  //   const subValue = {
  //     [subField.name]: newValue,
  //   };

  //   if (subField.oneof !== undefined) {
  //     console.log("DANGER-FIX ME");
  //     console.log(subValue);
  //     console.log(newValue);
  //     props.onChange(subField, newValue);
  //     return;
  //   }

  //   subValue[subField.name] = newValue;
  //   props.onChange(subField, subValue);
  // };

  // const subOneofOnChange = (subOneof: OneofGroup, newValue: any) => {
  //   console.log("SUB ONEOF CHANGE: " + subOneof.oneofFieldName);
  //   console.log(newValue);
  //   // const subValue = {
  //   //   [subField.name]: newValue,
  //   // };
  //   // subValue[subField.name] = newValue;
  //   props.onChange(subOneof.parentGroupField, newValue);
  // };

  return (
    <div>
      <ul>
        {
          oneofGroups.map(oog => (
            <MessageOneofInputComponent
              oneofGroup={oog}
              // oneofGroupField={oog.}
              oneofName={oog.oneofFieldName}
              // activeOneOfGroupName={activeOneOfGroups.get(oog.oneofFieldName)!}
              oneofFields={oog.oneofFields}
              onChange={props.onChange}
              // subOneofOnChange={subOneofOnChange}
              key={oog.oneofFieldName}
              clearParentFieldValue={props.clearParentFieldValue}
            />
          ))
        }
      </ul>

      <ul>
        {nonOneofFields.map(f => {
          // const subMessageOnChange = (subField: FieldInfo, newValue) => {
          //   console.log("SUBMESSAGE CHANGE: " + subField.name);
          //   console.log(newValue);
          //   const subValue = {
          //     // subField.name: newValue,
          //   };
          //   subValue[subField.name] = newValue;
          //   props.onChange(f, subValue);
          // };

          return (
            <MessageSingleFieldInputComponent
              field={f}
              // requestMessageType={f}
              onChange={props.onChange}
              // onChange={subMessageOnChange}
              key={f.name}
              />
          )
        }
        )}
      </ul>
    </div>
  )
}