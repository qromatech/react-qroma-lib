import React from "react"
import { FieldInfo, JsonObject, JsonValue } from "@protobuf-ts/runtime"
import { createValueForField } from "./builder_utils"
import { MessageEnumFieldInputComponent } from "./MessageEnumFieldInputComponent"
import { MessageScalarFieldInputComponent } from "./MessageScalarFieldInputComponent"
import { QromaPbMessageComponent } from "./QromaPbMessageComponent"



export interface IQromaPbOneofContainerComponent {
  allFieldsInParent: readonly FieldInfo[]
  oneofFieldName: string
  oneofValue: any

  updateFieldValueInParentMessage: (fieldToUpdate: FieldInfo, objectValue: JsonValue) => void
  setActiveOneofFieldInParentMessage: (oldActiveField: FieldInfo, newActiveField: FieldInfo, newFieldValue: JsonValue) => void
}


export const QromaPbOneofContainerComponent = (props: IQromaPbOneofContainerComponent) => {

  const activeOneofSelection = props.oneofValue['oneofKind'];

  const activeOneofSelectionField = props.allFieldsInParent.find(f => f.name === activeOneofSelection);
  const relatedOneofFieldsInParent = props.allFieldsInParent.filter(f => f.oneof === props.oneofFieldName);

    
  const handleOneofSelectionChange = (e: { target: { value: any } }) => {
    const newValue = e.target.value;
    // console.log("handleOneofSelectionChange - NEW VALUE: " + newValue);
    // console.log(props)
    // console.log(activeOneofSelectionField)

    var selectedField = props.allFieldsInParent.find(f => f.name === newValue);

    const selectedFieldInitValue = createValueForField(selectedField);

    // console.log("NEW VALUE FOR SELECTED FIELD")
    // console.log(selectedFieldInitValue)
    // console.log(selectedField)
    
    props.setActiveOneofFieldInParentMessage(activeOneofSelectionField, selectedField, selectedFieldInitValue);
  }

  const onOneofScalarValueChange = (field: FieldInfo, newValue: JsonValue) => {
    // console.log("QromaPbOneofContainerComponent - SCALAR ON CHANGE");
    // console.log(field)
    // console.log(newValue)

    // const updateValue = {[field.name]: newValue};
    
    // props.updateOneofFieldValueInParent(field, updateValue);
    props.updateFieldValueInParentMessage(field, newValue);
  }

  const onOneofEnumValueChange = (field: FieldInfo, objectValue: JsonValue) => {
    console.log("QromaPbOneofContainerComponent - ENUM ON CHANGE");

    console.log(field)
    console.log(objectValue)

    // const newValue = {[field.name]: objectValue}
    // console.log(objectKey);
    // console.log(objectValue)
    // console.log(newValue)

    // props.updateOneofFieldValueInParent(field, objectValue);
    props.updateFieldValueInParentMessage(field, objectValue);
  }

  const onOneofMessageValueUpdate = (field: FieldInfo, objectValue: JsonValue) => {
    // console.log("QromaPbOneofContainerComponent - MESSAGE ON UPDATE");

    // console.log(props)
    // console.log(activeOneofSelectionField)
    // console.log(field)
    // console.log(objectValue)

    let valueToSet;


    // console.log("ACTTIVE ONE OF SELECTION FIELD", activeOneofSelectionField)

    if (field.kind === 'message') {
      valueToSet = objectValue;

      props.updateFieldValueInParentMessage(field, valueToSet);
    } else {
      valueToSet = {
        [field.name]: objectValue,
      }

      props.updateFieldValueInParentMessage(activeOneofSelectionField, valueToSet);
    }

    // console.log("QromaPbOneofContainerComponent.onOneofMessageValueChange() - CALLING updateOneofFieldValueInParent")
    // console.log(activeOneofSelectionField)
    // console.log("VALUE TO SET", activeOneofSelectionField, valueToSet)

    props.updateFieldValueInParentMessage(activeOneofSelectionField, valueToSet);
  }

  const handleSubOneofActiveSelectionChange = (oldActiveField: FieldInfo, newActiveField: FieldInfo, newFieldValue: JsonValue) => {
    console.log("QromaPbOneofContainerComponent - ACTIVE SUB ONE OF ON CHANGE");

    // console.log(props)
    // console.log(activeOneofSelectionField)
    // console.log(oldActiveField)
    // console.log(newActiveField)
    // console.log(newFieldValue)

    const valueToSet = {
      // ...props.oneofValue[activeOneofSelection],
      [newActiveField.name]: newFieldValue,
    }
    delete valueToSet[oldActiveField.name];

    console.log("SETTING VALUE - " + newActiveField.name)
    console.log(valueToSet) 

    props.setActiveOneofFieldInParentMessage(activeOneofSelectionField, newActiveField, newFieldValue);
  }


  const oneofSelect = 
    <select value={activeOneofSelection} onChange={handleOneofSelectionChange}>
      {
        relatedOneofFieldsInParent.map(f => {
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
  // console.log(activeOneofSelection)
  // console.log(activeOneofSelectionField)


  let oneofValueComponent = <></>;
  switch (activeOneofSelectionField.kind) {
    case 'enum':
      const enumValue = props.oneofValue[activeOneofSelection];
      oneofValueComponent = 
        <MessageEnumFieldInputComponent
          key={activeOneofSelectionField.name}
          field={activeOneofSelectionField}
          isFieldUsedAsOneof={true}
          value={enumValue}
          updateFieldInParent={(objectKey, objectValue) => onOneofEnumValueChange(activeOneofSelectionField, objectValue)}
          />;
      break;

    case 'scalar':
      const scalarValue = props.oneofValue[activeOneofSelection];

      oneofValueComponent = 
        <MessageScalarFieldInputComponent
          key={activeOneofSelectionField.name}
          field={activeOneofSelectionField}
          isFieldUsedAsOneof={true}
          value={scalarValue}
          updateFieldInParent={(objectKey, objectValue) => onOneofScalarValueChange(activeOneofSelectionField, objectValue)}
          />;
      break;

    case 'message':
      const msgValue = props.oneofValue[activeOneofSelection];
      const msgValueJsonData = msgValue[activeOneofSelectionField.name];

      // console.log("PB ONE OF CONTAINER MSG VALUE JSON DATA")
      // console.log(msgValueJsonData)
      
      oneofValueComponent = 
        <QromaPbMessageComponent
          key={activeOneofSelectionField.name}
          messageName={activeOneofSelectionField.name}
          messageType={activeOneofSelectionField.T()}
          messageValue={msgValue as JsonObject}
          messageValueJsonData={msgValueJsonData}
          fieldInParent={activeOneofSelectionField}
          updateFieldValueInParentMessage={(fieldToReplace, objectValue) => onOneofMessageValueUpdate(fieldToReplace, objectValue)}
          setActiveOneofFieldInParentMessage={(oldActiveField, newActiveField, newFieldValue) => handleSubOneofActiveSelectionChange(oldActiveField, newActiveField, newFieldValue)}
          />;

      break;
    default:
      throw new Error("Unhandled field kind");
  }

  return (
    <div>
      <fieldset style={{backgroundColor: 'lightblue'}}>
        {props.oneofFieldName} [oneof]
        {oneofSelect}
        <div>
          ONEOF: {props.oneofFieldName} [{activeOneofSelection}] - {JSON.stringify(props.oneofValue)}
          { oneofValueComponent }
        </div>
      </fieldset>
    </div>
  )
}
