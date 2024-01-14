import React from "react"
import { FieldInfo, JsonObject, JsonValue } from "@protobuf-ts/runtime"
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
  updateOneofFieldInParent: (oldActiveField: FieldInfo, newActiveField: FieldInfo, newFieldValue: JsonValue) => void
}


export const QromaPbOneofComponent = (props: IQromaPbOneofComponent) => {

  const handleOneofSelectionChange = (e: { target: { value: any } }) => {
    const newValue = e.target.value;
    console.log("handleOneofSelectionChange - NEW VALUE: " + newValue);
    console.log(props)

    var selectedField = props.relatedOneofFieldsInParent.find(f => f.name === newValue);

    const selectedFieldInitValue = createValueForField(selectedField);

    console.log("NEW VALUE FOR SELECTED FIELD")
    console.log(selectedFieldInitValue)
    console.log(selectedField)
    
    props.updateOneofFieldInParent(props.activeOneofField, selectedField, selectedFieldInitValue);
  }

  
  const onOneofScalarValueChange = (objectKey: string, newValue: JsonValue) => {
    console.log("QromaPbOneofComponent - SCALAR ON CHANGE");
    
    props.updateFieldInParent(objectKey, newValue);
  }


  const onOneofEnumValueChange = (objectKey: string, objectValue: JsonValue) => {
    console.log("QromaPbOneofComponent - ENUM ON CHANGE");

    const newValue = {[objectKey]: objectValue}
    console.log(objectKey);
    console.log(objectValue)
    console.log(newValue)

    props.updateFieldInParent(objectKey, objectValue);
  }


  const onOneofMessageValueChange = (fieldToReplace: FieldInfo, objectValue: JsonValue) => {
    console.log("TODO - bring this back")
    console.log(props)
    console.log(fieldToReplace)
    console.log(objectValue)

    props.updateFieldInParent(props.activeOneofValue, objectValue);
  }


  const onPbChildOneofSelectionChange = (oldActiveField: FieldInfo, newActiveField: FieldInfo, newFieldValue: JsonValue) => {
    console.log("QromaPbOneofComponent - onPbChildOneofSelectionChange should not be called")
  }

  
  if (props.activeOneofField.kind === 'map') {
    throw new Error("Unrecognized field kind for QromaPbOneofComponent");
  }
  
  const oneofKind = props.activeOneofField.name;
  const oneofFieldValue = props.activeOneofValueJsonData

  // console.log("SELECT VALUE SHOULD BE " + oneofKind)
  // console.log(props)
  // console.log(props.activeOneofField)
  // console.log(oneofFieldValue)

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

  // console.log("PB ONE OF fieldForSelectedOneof")
  // console.log(props);


  let oneofValueComponent = <></>;
  switch (props.activeOneofField.kind) {
    case 'enum':
      oneofValueComponent = 
        <MessageEnumFieldInputComponent
          key={props.activeOneofField.name}
          field={props.activeOneofField}
          isFieldUsedAsOneof={true}
          value={oneofFieldValue}
          updateFieldInParent={onOneofEnumValueChange}
          />;
      break;
    case 'scalar':
      oneofValueComponent = 
        <MessageScalarFieldInputComponent
          key={props.activeOneofField.name}
          field={props.activeOneofField}
          isFieldUsedAsOneof={true}
          value={oneofFieldValue}
          updateFieldInParent={onOneofScalarValueChange}
          />;
      break;
    case 'message':
      oneofValueComponent = 
        <QromaPbMessageComponent
          key={props.activeOneofField.name}
          messageName={props.activeOneofField.name}
          messageType={props.activeOneofField.T()}
          messageValue={oneofFieldValue as JsonObject}
          messageValueJsonData={props.activeOneofValueJsonData[props.activeOneofField.name]}
          fieldInParent={props.activeOneofField}
          isFieldUsedAsOneof={true}
          setFieldValueInParentMessage={onOneofMessageValueChange}
          setActiveOneofFieldInParent={onPbChildOneofSelectionChange}
          />;
      break;
    default:
      throw new Error("Unhandled field kind");
  }
  

  return (
    <div>
      <fieldset style={{backgroundColor: 'lightblue'}}>
        {props.activeOneofField.oneof} [oneof]
        {oneofSelect}
        <div>
          { oneofValueComponent }
        </div>
      </fieldset>
    </div>
  )
}