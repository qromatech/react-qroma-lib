import React from "react"
import { FieldInfo, JsonValue } from "@protobuf-ts/runtime"
import { QromaPbOneofComponent } from "./QromaPbOneofComponent";
import { MessageScalarFieldInputComponent } from "./MessageScalarFieldInputComponent";
import { MessageEnumFieldInputComponent } from "./MessageEnumFieldInputComponent";
import { QromaPbMessageComponent } from "./QromaPbMessageComponent";


export interface IQromaPbFieldComponentProps {
  field: FieldInfo
  messageValue: any
  messageValueJsonData: JsonValue
  containingMessageFields: readonly FieldInfo[]
  updateFieldInParentMessage: (sourceField: FieldInfo, objectValue: JsonValue) => void
  updateOneofFieldInParentMessage: (fieldToReplace: FieldInfo, newFieldOneofKind: string, newFieldValue: JsonValue) => void
}

export const QromaPbFieldComponent = (props: IQromaPbFieldComponentProps) => {

  const onScalarValueChange = (objectKey: string, newValue: JsonValue) => {
    console.log("QromaPbFieldComponent - SCALAR ON CHANGE");
    console.log(props)
    console.log(objectKey)
    console.log(newValue)
    
    props.updateFieldInParentMessage(props.field, newValue);
  }


  const onEnumValueChange = (objectKey: string, newValue: JsonValue) => {
    console.log("QromaPbFieldComponent - ENUM ON CHANGE");
    
    props.updateFieldInParentMessage(props.field, newValue);
  }


  const onMessageValueChange = (sourceField: FieldInfo, newValue: any) => {
    console.log("QromaPbFieldComponent - MESSAGE ON CHANGE");
    console.log(sourceField)
    console.log(newValue)

    if (sourceField.kind === 'message') {
      const updateMessage = props.messageValueJsonData[props.field.name];
      console.log("HAVE PB FIELD MESSAGE UPDATE")
      console.log(props.field)
      console.log(updateMessage)
      props.updateFieldInParentMessage(props.field, updateMessage);

    } else {
      console.log("HAVE PB FIELD MESSAGE VALUE UPDATE")
      console.log(props.field.name)
      console.log(newValue)
      props.updateFieldInParentMessage(props.field, newValue);
    }
  }

  
  const onPbOneofChange = (objectKey: string, objectValue: any) => {
    console.log("QromaPbFieldComponent - onPbOneofChange");
    console.log(objectKey)
    console.log(objectValue)

    props.updateFieldInParentMessage(props.field, objectValue);
  }

  
  const updateOneofFieldInParent = (fieldToReplace: FieldInfo, newFieldName: string, newFieldValue: JsonValue) => {
    console.log("WEIRD TIME TO BE CALLING replaceMessageField() IN QromaPbFieldComponent")
    console.log(props)
    console.log(fieldToReplace)
    console.log(newFieldName)
    console.log(newFieldValue)

    props.updateOneofFieldInParentMessage(fieldToReplace, newFieldName, newFieldValue);
  }

  console.log("RENDERING QROMA PB FIELD COMPONENT - " + props.field.name)
  console.log(props)
  console.log(props.messageValue)
  console.log(props.messageValue[props.field.name])


  if (props.field.oneof !== undefined) {
    const selectedOneofGroupValue = props.messageValue[props.field.oneof];

    console.log("SELECTING ONE OF VALUE");
    console.log(props)
    console.log(selectedOneofGroupValue)

    const relatedOneofFieldsInParent = props.containingMessageFields.filter(f => f.oneof === props.field.oneof);

    const selectedOneofGroupKind = selectedOneofGroupValue.oneofKind;
    console.log("SELECTING ONE OF GROUP - KIND");
    console.log(selectedOneofGroupKind)

    return (
      <QromaPbOneofComponent
        key={props.field.name}
        activeOneofField={props.field}
        activeOneofValue={selectedOneofGroupKind}
        activeOneofValueJsonData={selectedOneofGroupValue[selectedOneofGroupValue.oneofKind]}
        relatedOneofFieldsInParent={relatedOneofFieldsInParent}
        updateFieldInParent={onPbOneofChange}
        updateOneofFieldInParent={updateOneofFieldInParent}
        />
    )
  }

  const fieldNamesPathStr = props.field.name;

  switch (props.field.kind) {
    case "scalar":
      console.log("SCLARA PB FIELD VALUE FOR FIELD " + props.field.name);
      const value = props.messageValue[fieldNamesPathStr];
      console.log(props)
      console.log(value)

      return (
        <MessageScalarFieldInputComponent
          key={props.field.name}
          field={props.field}
          isFieldUsedAsOneof={false}
          value={value}
          updateFieldInParent={onScalarValueChange}
          />
      )

    case "enum":
      return (
        <MessageEnumFieldInputComponent
          key={props.field.name}
          field={props.field}
          isFieldUsedAsOneof={false}
          value={props.messageValue[fieldNamesPathStr]}
          updateFieldInParent={onEnumValueChange}
          />
      )

    case "message":
      console.log("MESSAGE COMPONENT")
      console.log(props.field)

      if (props.field.oneof === undefined) {

        console.log("MESSAGES")
        console.log(props.messageValue)
        const subMessageValue = props.messageValue[props.field.name];
        if (subMessageValue === undefined) {
          return;
        }
        console.log(subMessageValue)

        const subMessageValueJsonData = props.messageValueJsonData[props.field.name];

        return (
          <QromaPbMessageComponent
            key={props.field.name}
            messageName={props.field.name}
            messageType={props.field.T()}
            messageValue={subMessageValue}
            messageValueJsonData={subMessageValueJsonData}
            fieldInParent={props.field}
            isFieldUsedAsOneof={false}
            updateFieldInParentMessage={newValue => onMessageValueChange(props.field, newValue)}
            updateOneofFieldInParentMessage={props.updateOneofFieldInParentMessage}
            />
        )
      }

    default:
      return (
        <div key={props.field.name}>
          {/* {field.name} - '{props.messageValue[fieldNamesPathStr]}' [{fieldNamesPathStr}] */}
          {props.field.name} - [{fieldNamesPathStr}]
        </div>
      )
  }
}

