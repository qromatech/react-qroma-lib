import React, { useState } from "react"
import { EnumInfo, FieldInfo } from "@protobuf-ts/runtime"


interface EnumItem {
  enumInt: number
  valueName: string
}

interface IEnumerationInputValuesComponentProps {
  enumInfo: EnumInfo
  onChange: (newValue: string) => void
}


const EnumerationInputValuesComponent = (props: IEnumerationInputValuesComponentProps) => {
  const enumInfo = props.enumInfo;

  // const enumName = enumInfo[0];
  const enumValues = enumInfo[1];
  // const typePrefix = enumInfo[2];

  const enumItems = [] as EnumItem[];
  
  for (const key in enumValues) {
    try {
      if (Number.isNaN(parseInt(key))) {
        continue;
      }

      const enumInt = parseInt(key);
      const valueName = enumValues[enumInt];

      enumItems.push({ enumInt, valueName })

    } catch (e) { }
  }

  const [selectedValue, setSelectedValue] = useState(enumItems[0].valueName);
  const handleChange = (e: { target: { value: any } }) => {
    const newValue = e.target.value;
    console.log(newValue);
    console.log("NEW VALUE: " + newValue);
    setSelectedValue(newValue);
    props.onChange(newValue)
  }

  return (
    <select value={selectedValue} onChange={handleChange}>
      {enumItems.map((option) => (
        <option key={option.valueName} value={option.valueName}>
          {option.valueName}
        </option>
      ))}
    </select>
  )
}


interface IMessageEnumFieldInputComponentProps {
  field: FieldInfo
  onChange: <T>(field: FieldInfo, newValue: T) => void
}


export const MessageEnumFieldInputComponent = (props: IMessageEnumFieldInputComponentProps) => {
  const field = props.field;

  if (field.kind !== 'enum') {
    return <div>Non-enum input field provided: {field.name}</div>
  }

  const onChange = (newValue: any) => {
    props.onChange(field, newValue);
  }

  const enumInfo = field.T();


  return (
    <div>
      {field.name} [{field.kind}: {enumInfo[0]}] 
      <EnumerationInputValuesComponent
        enumInfo={enumInfo}
        onChange={onChange}
        />
    </div>
  )
}