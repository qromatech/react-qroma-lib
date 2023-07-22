import React from "react";
import { FieldInfo } from "@protobuf-ts/runtime";
import { MessageSingleFieldDetailsComponent } from "./MessageSingleFieldDetailsComponent";
import { MessageOneofDetailsComponent } from "./MessageOneofDetailsComponent";


interface OneofGroup {
  oneofFieldName: string
  oneofFields: FieldInfo[]
}

interface IMessageAllFieldsDetailsComponentProps {
  messageTypeName: string
  fields: readonly FieldInfo[]
}


export const MessageAllFieldsDetailsComponent = (props: IMessageAllFieldsDetailsComponentProps) => {

  const fields = props.fields;
  
  const oneofFields = fields.filter(f => f.oneof);
  const oneofMap = new Map<string, FieldInfo[]>();

  for (var f of oneofFields) {
    const oneof = f.oneof!;
    if (oneofMap.has(oneof)) {
      oneofMap.get(oneof)!.push(f)
    } else {
      oneofMap.set(oneof, [f]);
    }
  }

  const oneofGroups = [] as OneofGroup[];
  for (let [k, v] of oneofMap) {
    console.log(k);
    oneofGroups.push({
      oneofFieldName: k,
      oneofFields: v,
    });
  }

  const nonOneofFields = fields.filter(f => !f.oneof);


  return (
    <div>
      <ul>
        {
          oneofGroups.map(oog => (
            <MessageOneofDetailsComponent
              oneofName={oog.oneofFieldName}
              fields={oog.oneofFields}
              key={oog.oneofFieldName}
            />
          ))
        }
      </ul>

      <ul>
        {nonOneofFields.map(f => (
          <MessageSingleFieldDetailsComponent
            field={f}
            key={f.name}
            />
        ))}
      </ul>
    </div>
  )
}