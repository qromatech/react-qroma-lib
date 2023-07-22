import { FieldInfo } from "@protobuf-ts/runtime"
import React, { useState } from "react"
import { MessageSingleFieldInputComponent } from "./MessageSingleFieldInputComponent"
import { OneofGroup } from "./MessageAllFieldsInputComponent"


interface IMessageOneofInputComponent {
  oneofName: string
  // oneofGroupField: FieldInfo
  oneofGroup: OneofGroup
  // activeOneOfGroupName: string
  oneofFields: FieldInfo[]
  onChange: <T>(field: FieldInfo, newValue: T) => void
  clearParentFieldValue: (fieldName: string) => void
  // onChange: <T>(subOneof: OneofGroup, newValue: T) => void
}


export const MessageOneofInputComponent = (props: IMessageOneofInputComponent) => {

  console.log("ONE OF FIELDS");
  console.log(props.oneofFields);
  console.log(props.oneofGroup)

  const [selectedOneofGroupName, setSelectedOneOfGroupName] = useState(props.oneofFields[0].name);
  // const [selectedOneofGroupName, setSelectedOneOfGroupName] = useState(props.oneofGroup.oneofFieldName);
  // const [selectedOneofGroupName, setSelectedOneOfGroupName] = useState(props.oneofFields[0].name);
  // const selectedOneofGroupName = props.activeOneOfGroupName;

  console.log(selectedOneofGroupName);

  const handleOneofSelectionChange = (e: { target: { value: any } }) => {
    const newValue = e.target.value;
    console.log(newValue);
    console.log("NEW VALUE: " + newValue);
    // setSelectedValue(newValue);
    // props.onChange(newValue)
    props.clearParentFieldValue(selectedOneofGroupName);

    setSelectedOneOfGroupName(newValue);
  }

  console.log("OOG");
  console.log(props.oneofGroup);
  console.log(selectedOneofGroupName);

  
  const onOneofFieldsChange = (field: FieldInfo, newValue: any) => {
    console.log("onOneofFieldsChange");
    console.log(field);
    console.log(newValue);

    // const selectedOneofGroupField = props.oneofFields.find(f => f.name === selectedOneofGroupName)!;
    // console.log(selectedOneofGroupField);
    // console.log(props.oneofGroup);

    // const selectedOneofGroupField = props.oneofGroup.oneofFields.find(f => f.name === field.name)!;
    const selectedOneofGroupField = props.oneofGroup.oneofFields.find(f => f.name === selectedOneofGroupName)!;
    console.log(selectedOneofGroupField);
    console.log(props.oneofGroup);

    // const oneofToUpdate = {
    //   [props.oneofGroup.oneofFieldName]: {
    //     [selectedOneofGroupName]: newValue
    //   }
    // };
    const oneofToUpdate = {
      [selectedOneofGroupName]: newValue
    };
    console.log("ONE OF TO UPDATE");
    console.log(oneofToUpdate);
    console.log(props.oneofGroup.parentGroupField);
    console.log(selectedOneofGroupField);

    props.onChange(selectedOneofGroupField, newValue);
    // props.subOneofOnChange(props.oneofGroup, selectedOneofGroupName, newValue);
  }



  const oneofSelect = 
    <select value={selectedOneofGroupName} onChange={handleOneofSelectionChange}>
      {
        props.oneofGroup.oneofFields.map(f => {
          return (
            <option key={f.name} value={f.name}>
              {f.name}
            </option>
          )
        })
      }
    </select>

  const selectedOneofGroupFields = props.oneofFields.find(f => f.name === selectedOneofGroupName);
  console.log("selectedOneofGroupFields");
  console.log(selectedOneofGroupFields);

  

  return (
    <>
      {props.oneofName} [oneof]
      {oneofSelect}

      {selectedOneofGroupFields === undefined ? undefined :
        <>
          <MessageSingleFieldInputComponent
            field={selectedOneofGroupFields}
            // onChange={props.onChange}
            onChange={onOneofFieldsChange}
            key={selectedOneofGroupFields.name}
            />
        </>
      }
    </>
  )
}