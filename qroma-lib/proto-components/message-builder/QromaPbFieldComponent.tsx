import React from "react"
import { FieldInfo } from "@protobuf-ts/runtime"
import { QromaPbOneofComponent } from "./QromaPbOneofComponent";
import { MessageScalarFieldInputComponent } from "./MessageScalarFieldInputComponent";
import { MessageEnumFieldInputComponent } from "./MessageEnumFieldInputComponent";
import { QromaPbMessageComponent } from "./QromaPbMessageComponent";


interface IQromaPbFieldComponent {
  field: FieldInfo
  messageValue: any
  containingMessageFields: readonly FieldInfo[]
  updateParent: (objectKey: string, objectValue: any) => void


  // // requestMessageType: MessageType<T>
  // messageType: IMessageType<T>
  // // messageName: string
  // // typeName: string
  // messageValue: T
  // fields: readonly FieldInfo[]
  // // onScalarValueChange: <T>(field: FieldInfo, newValue: T) => void
  // // onOneofChange: (oneof: OneofGroup, oneofSelection: string) => void
  // // onEnumChange: (enumDef: any, enumStrValue: string, enumIntValue: number) => void
  // updateParentOneofValue: (fieldName: string, value: any) => void
  // updateParentMemberValue: (fieldName: string, value: any) => void
}

export const QromaPbFieldComponent = (props: IQromaPbFieldComponent) => {
  const field = props.field;
    
  // const fieldNamesPathStr = f.oneof !== undefined ? f.name : props.fieldNamesPath.join(":");
  const fieldNamesPathStr = field.name

  const onScalarValueChange = (field: FieldInfo, newValue: any) => {
    console.log("QromaPbFieldComponent - SCALAR ON CHANGE");
    console.log(field)
    console.log(newValue)

    props.updateParent(field.name, newValue);
  }

  const onEnumValueChange = (field: FieldInfo, newValue: string, newValueInt: number) => {
    console.log("QromaPbFieldComponent - ENUM ON CHANGE");
    console.log(field)
    console.log(newValueInt)
    console.log(newValue)

    props.updateParent(field.name, newValueInt);
  }

  const onMessageValueChange = (field: FieldInfo, newValue: any) => {
    console.log("QromaPbFieldComponent - MESSAGE ON CHANGE");
    console.log(field)
    console.log(newValue)

    // props.updateParent(field.name, newValue);
  }

  const onPbOneofChange = (objectKey: string, objectValue: any) => {
    console.log("QromaPbFieldComponent - onPbOneofChange");
    console.log(objectKey)
    console.log(objectValue)

    props.updateParent(objectKey, objectValue);
  }

  console.log("RENDERING QROMA PB FIELD COMPONENT - " + field.name)
  console.log(props.messageValue)
  console.log(props.messageValue[field.oneof])


  if (field.oneof !== undefined) {
    console.log("SELECTING ONE OF VALUE");
    const selectedOneofGroupValue = props.messageValue[field.oneof].oneofKind;
    console.log(selectedOneofGroupValue)

    return (
      <QromaPbOneofComponent
        key={field.name}
        oneofName={field.oneof}
        selectedOneofGroupValue={selectedOneofGroupValue}
        field={field}
        oneofContainerValue={props.messageValue[field.oneof]}
        parentObject={props.messageValue}
        containingMessageFields={props.containingMessageFields}
        updateParent={onPbOneofChange}
        value={props.messageValue}
        />
    )
  }

  switch (field.kind) {
    case "scalar":
      console.log("SCLARA PB FIELD VALUE FOR FIELD " + field.name)
      // const value = getScalarValueFromParentObject(field, props.messageValue);
      const value = props.messageValue[fieldNamesPathStr];
      console.log(value)

      return (
        <MessageScalarFieldInputComponent
          key={field.name}
          value={value}
          field={field}
          onChange={onScalarValueChange}
          />
      )

    case "enum":
      // console.log("ENUM VALUE")
      // console.log(props.messageValue[fieldNamesPathStr])
      return (
        <MessageEnumFieldInputComponent
          key={field.name}
          field={field}
          onEnumValueChange={(newValue, newValueInt) => onEnumValueChange(field, newValue, newValueInt)}
          value={props.messageValue[fieldNamesPathStr]}
          />
      )

    case "message":
      console.log("MESSAGE COMPONENT")
      console.log(field)

      if (field.oneof === undefined) {

        console.log("MESSAGES")
        console.log(props.messageValue)
        const subMessageValue = props.messageValue[field.name];
        if (subMessageValue === undefined) {
          return;
        }
        console.log(subMessageValue)

        return (
          <QromaPbMessageComponent
            key={field.name}
            messageName={field.name}
            messageType={field.T()}
            messageValue={subMessageValue}
            // fieldNamesPath={[]}
            updateParent={newValue => onMessageValueChange(field, newValue)}
            />
        )
      }

    default:
      return (
        <div key={field.name}>
          {/* {field.name} - '{props.messageValue[fieldNamesPathStr]}' [{fieldNamesPathStr}] */}
          {field.name} - [{fieldNamesPathStr}]
        </div>
      )
  }
}

