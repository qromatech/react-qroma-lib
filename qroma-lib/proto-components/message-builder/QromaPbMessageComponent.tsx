import React from "react"
import { FieldInfo, IMessageType } from "@protobuf-ts/runtime"
import { QromaPbFieldComponent } from "./QromaPbFieldComponent"


interface IMessageInputComponentProps<T extends object> {
  messageType: IMessageType<T>
  messageName: string
  // fieldNamesPath: string[]
  messageValue: T
  updateParent: (objectKey: string, objectValue: any) => void

  // parentMessageField: FieldInfo
}


export const QromaPbMessageComponent = <T extends object>(props: IMessageInputComponentProps<T>) => {

  if (props.messageValue === undefined) {
    console.log("UNDEFINED MESSAGE VALUE IN PB MESSAGE COMPONENT")
    console.log(props.messageName)
  }

  const fields = props.messageType.fields;
  
  console.log("RENDERING QromaPbMessageComponent - " + props.messageName)
  console.log(props.messageValue)
  

  const updateParent = (objectKey: string, objectValue: any) => {
    console.log("QromaPbMessageComponent - UPDATE PARENT");
    console.log(objectKey);
    console.log(objectValue);
    console.log(props.messageValue)

    props.updateParent(objectKey, objectValue);
  }

  const renderedOneofFieldNames = new Set();
  const subComponents = [];

  fields.forEach(field => {
    if (field.oneof !== undefined) {
      if (renderedOneofFieldNames.has(field.oneof)) {
        return;
      }
      renderedOneofFieldNames.add(field.oneof);
    }

    const subComponent = 
      <QromaPbFieldComponent
        key={field.name}
        field={field}
        messageValue={props.messageValue}
        containingMessageFields={fields}
        updateParent={updateParent}
        />;
    subComponents.push(subComponent);
  });


  return (
    <div>
      {props.messageName} [{props.messageType.typeName}] +++
      <fieldset>
        {subComponents}
      </fieldset>
    </div>
  )
}
