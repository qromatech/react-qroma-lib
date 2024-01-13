import React from "react"
import { FieldInfo, JsonObject, JsonValue } from "@protobuf-ts/runtime"
import { QromaPbOneofComponent } from "./QromaPbOneofComponent";
import { MessageScalarFieldInputComponent } from "./MessageScalarFieldInputComponent";
import { MessageEnumFieldInputComponent } from "./MessageEnumFieldInputComponent";
import { QromaPbMessageComponent } from "./QromaPbMessageComponent";


export interface IQromaPbFieldComponentProps {
  field: FieldInfo
  messageValue: any
  messageValueJsonData: JsonValue
  containingMessageFields: readonly FieldInfo[]
  updateFieldInParentMessage: (sourceField: FieldInfo, objectKey: string, objectValue: JsonValue) => void
  updateOneofFieldInParentMessage: (fieldToReplace: FieldInfo, newFieldOneofKind: string, newFieldValue: JsonValue) => void
}

export const QromaPbFieldComponent = (props: IQromaPbFieldComponentProps) => {
  const field = props.field;
    

  const onScalarValueChange = (objectKey: string, newValue: JsonValue) => {
    console.log("QromaPbFieldComponent - SCALAR ON CHANGE");
    console.log(objectKey)
    console.log(newValue)

    props.updateFieldInParentMessage(props.field, objectKey, newValue);
  }


  const onEnumValueChange = (objectKey: string, newValue: JsonValue) => {
    console.log("QromaPbFieldComponent - ENUM ON CHANGE");
    
    props.updateFieldInParentMessage(props.field, objectKey, newValue);
    
    // props.updateFieldInParent(field.name, newValueInt);
  }


  const onMessageValueChange = (sourceField: FieldInfo, newValue: any) => {
    console.log("QromaPbFieldComponent - MESSAGE ON CHANGE");
    console.log(field)
    console.log(newValue)

    if (sourceField.kind === 'message') {
      const updateMessage = props.messageValueJsonData[props.field.name];
      // updateMessage[sourceField.name] = newValue
      console.log("HAVE PB FIELD MESSAGE UPDATE")
      console.log(props.field)
      console.log(updateMessage)
      props.updateFieldInParentMessage(props.field, props.field.name, updateMessage);

    } else {
      console.log("HAVE PB FIELD MESSAGE VALUE UPDATE")
      console.log(props.field.name)
      console.log(newValue)
      props.updateFieldInParentMessage(props.field, props.field.name, newValue);
    }

    // props.updateFieldInParentMessage(props.field, field.name, newValue);
  }

  
  const onPbOneofChange = (objectKey: string, objectValue: any) => {
    console.log("QromaPbFieldComponent - onPbOneofChange");
    console.log(objectKey)
    console.log(objectValue)

    props.updateFieldInParentMessage(props.field, objectKey, objectValue);
  }

  
  const updateOneofFieldInParent = (fieldToReplace: FieldInfo, newFieldName: string, newFieldValue: JsonValue) => {
    console.log("WEIRD TIME TO BE CALLING replaceMessageField() IN QromaPbFieldComponent")
    console.log(props)
    console.log(fieldToReplace)
    console.log(newFieldName)
    console.log(newFieldValue)

    props.updateOneofFieldInParentMessage(fieldToReplace, newFieldName, newFieldValue);
  }

  console.log("RENDERING QROMA PB FIELD COMPONENT - " + field.name)
  console.log(props)
  console.log(props.messageValue)
  console.log(props.messageValue[field.name])


  if (field.oneof !== undefined) {
    const selectedOneofGroupValue = props.messageValue[field.oneof];

    console.log("SELECTING ONE OF VALUE");
    console.log(props)
    console.log(selectedOneofGroupValue)

    const relatedOneofFieldsInParent = props.containingMessageFields.filter(f => f.oneof === field.oneof);

    const selectedOneofGroupKind = selectedOneofGroupValue.oneofKind;
    console.log("SELECTING ONE OF GROUP - KIND");
    console.log(selectedOneofGroupKind)

    return (
      <QromaPbOneofComponent
        key={field.name}
        activeOneofField={field}
        activeOneofValue={selectedOneofGroupKind}
        activeOneofValueJsonData={selectedOneofGroupValue[selectedOneofGroupValue.oneofKind]}
        relatedOneofFieldsInParent={relatedOneofFieldsInParent}
        updateFieldInParent={onPbOneofChange}
        updateOneofFieldInParent={updateOneofFieldInParent}
        />
    )
  }

  const fieldNamesPathStr = field.name;

  switch (field.kind) {
    case "scalar":
      console.log("SCLARA PB FIELD VALUE FOR FIELD " + field.name);
      const value = props.messageValue[fieldNamesPathStr];
      console.log(props)
      console.log(value)

      return (
        <MessageScalarFieldInputComponent
          key={field.name}
          field={field}
          value={value}
          updateFieldInParent={onScalarValueChange}
          />
      )

    case "enum":
      return (
        <MessageEnumFieldInputComponent
          key={field.name}
          field={field}
          value={props.messageValue[fieldNamesPathStr]}
          updateFieldInParent={onEnumValueChange}
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

        const subMessageValueJsonData = props.messageValueJsonData[field.name];

        return (
          <QromaPbMessageComponent
            key={field.name}
            messageName={field.name}
            messageType={field.T()}
            messageValue={subMessageValue}
            messageValueJsonData={subMessageValueJsonData}
            updateFieldInParentMessage={newValue => onMessageValueChange(field, newValue)}
            updateOneofFieldInParentMessage={props.updateOneofFieldInParentMessage}
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

