import React from "react"
import { FieldInfo, JsonValue } from "@protobuf-ts/runtime"
import { OneofGroup } from "./defs"
import { createValueForField } from "./builder_utils"
import { MessageEnumFieldInputComponent } from "./MessageEnumFieldInputComponent"
import { MessageScalarFieldInputComponent } from "./MessageScalarFieldInputComponent"
import { QromaPbMessageComponent } from "./QromaPbMessageComponent"


export interface IQromaPbOneofComponent {
  relatedOneofFieldsInParent: readonly FieldInfo[]
  activeOneofField: FieldInfo
  activeOneofValue: any
  activeOneofValueJsonData: JsonValue
  updateFieldInParent: (objectKey: string, objectValue: JsonValue) => void
  updateOneofFieldInParent: (fieldToReplace: FieldInfo, newFieldOneofKind: string, newFieldValue: JsonValue) => void
}


export const QromaPbOneofComponent = (props: IQromaPbOneofComponent) => {

  console.log("QromaPbOneofComponent PROPS")
  console.log(props)


  const handleOneofSelectionChange = (e: { target: { value: any } }) => {
    const newValue = e.target.value;
    console.log(newValue);
    console.log("handleOneofSelectionChange - NEW VALUE: " + newValue);
    console.log("ONEOF NAME >> " + props.activeOneofField.oneof)

    var selectedField = props.relatedOneofFieldsInParent.find(f => f.name === newValue);

    const selectedFieldInitValue = createValueForField(selectedField);

    console.log("NEW VALUE FOR SELECTED FIELD")
    console.log(selectedFieldInitValue)
    console.log(selectedField)

    const oneofValue = {
      oneofKind: newValue,
      [newValue]: selectedFieldInitValue
    };

    console.log("PB ONEOF - handleOneofSelectionChange")
    console.log(props.activeOneofField.oneof, oneofValue)
    
    const newOneofName = selectedField.name;
    props.updateOneofFieldInParent(props.activeOneofField, newOneofName, selectedFieldInitValue);
  }

  
  const onScalarValueChange = (objectKey: string, newValue: JsonValue) => {
    console.log("QromaPbOneofComponent - SCALAR ON CHANGE");
    
    props.updateFieldInParent(objectKey, newValue);
  }


  const onEnumValueChange = (objectKey: string, objectValue: JsonValue) => {
    console.log("QromaPbOneofComponent - ENUM ON CHANGE");

    const newValue = {[objectKey]: objectValue}
    console.log(objectKey);
    console.log(objectValue)
    console.log(newValue)

    props.updateFieldInParent(objectKey, objectValue);
  }


  const onMessageValueChange = (objectKey: string, objectValue: JsonValue) => {
    console.log("TODO - bring this back")
    console.log(props)
    console.log(objectKey)
    console.log(objectValue)

    const updatedMessage = props.activeOneofValueJsonData;
    updatedMessage[objectKey] = objectValue;

    props.updateFieldInParent(props.activeOneofValue, updatedMessage);
  }


  const onPbChildOneofSelectionChange = (fieldToReplace: FieldInfo, newFieldOneofKind: string, newFieldValue: JsonValue) => {
    console.log("QromaPbOneofComponent - onPbOneofChildSelectionChange");
    console.log(fieldToReplace)
    console.log(newFieldOneofKind)
    console.log(newFieldValue)

    // props.updateFieldInParent(objectKey, objectValue);
    // props.updateOneofFieldInParent()
  }

  
  if (props.activeOneofField.kind === 'map') {
    throw new Error("Unrecognized field kind for QromaPbOneofComponent");
  }
  
  const oneofKind = props.activeOneofField.name;
  // const oneofFieldValue = props.activeOneofValue[props.activeOneofField.name];
  const oneofFieldValue = props.activeOneofValueJsonData

  console.log("SELECT VALUE SHOULD BE " + oneofKind)
  console.log(props)
  console.log(props.activeOneofField)
  console.log(oneofFieldValue)

  const oneofSelect = 
    <select value={oneofKind} onChange={handleOneofSelectionChange}>
      {
        props.relatedOneofFieldsInParent.map(f => {
          return (
            <option key={f.name} value={f.name}>
              {f.name} [{f.no}]
            </option>
          )
        })
      }
    </select>

  console.log("PB ONE OF fieldForSelectedOneof")
  console.log(props);


  let oneofValueComponent = <></>;
  switch (props.activeOneofField.kind) {
    case 'enum':
      oneofValueComponent = 
        <MessageEnumFieldInputComponent
          key={props.activeOneofField.name}
          field={props.activeOneofField}
          value={oneofFieldValue}
          updateFieldInParent={onEnumValueChange}
          />;
      break;
    case 'scalar':
      oneofValueComponent = 
        <MessageScalarFieldInputComponent
          key={props.activeOneofField.name}
          field={props.activeOneofField}
          value={oneofFieldValue}
          updateFieldInParent={onScalarValueChange}
          />;
      break;
    case 'message':
      oneofValueComponent = 
        <QromaPbMessageComponent
          key={props.activeOneofField.name}
          messageName={props.activeOneofField.name}
          messageType={props.activeOneofField.T()}
          messageValue={oneofFieldValue}
          messageValueJsonData={props.activeOneofValueJsonData[props.activeOneofField.name]}
          updateFieldInParentMessage={(objectKey, objectValue) => onMessageValueChange(objectKey, objectValue)}
          updateOneofFieldInParentMessage={onPbChildOneofSelectionChange}
          />;
      break;
    default:
      throw new Error("Unhandled field kind");
  }
  

  return (
    <div>
      <fieldset style={{backgroundColor: 'lightblue'}}>
      {props.activeOneofField.name} [oneof]
      {oneofSelect}
      <div>

      {/* <QromaPbFieldComponent
        field={fieldForSelectedOneof}
        messageValue={messageValue}
        containingMessageFields={containingMessageFields}
        updateParent={handleOneofValueChange}
        /> */}
        { oneofValueComponent }
      </div>
      </fieldset>
    </div>
  )
}