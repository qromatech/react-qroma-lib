import React, { useState } from "react"
import { EnumInfo, FieldInfo } from "@protobuf-ts/runtime"


interface EnumItem {
  enumInt: number
  valueName: string
}

const EnumerationValuesComponent = ({enumInfo}: {enumInfo: EnumInfo}) => {
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

  return (
    <div>
      <ul>
        {enumItems.map(ei => (
          <li key={ei.valueName}>
            {ei.valueName} [{ei.enumInt}]
          </li>
        ))}
      </ul>
    </div>
  );
}

export const MessageEnumFieldDetailsComponent = ({field}: {field: FieldInfo}) => {
  if (field.kind !== 'enum') {
    return <div>Non-enum field provided: {field.name}</div>
  }

  const [isExpanded, setIsExpanded] = useState(false);
  
  const ExpansionButton = () => {
    return <button onClick={() => setIsExpanded(!isExpanded)}>
      {isExpanded ? '-' : '+'}
    </button>
  }

  const enumInfo = field.T();


  return (
    <div>
      {field.name} [{field.kind}: {enumInfo[0]}] <ExpansionButton />
      {isExpanded ? 
        <EnumerationValuesComponent
          enumInfo={enumInfo}
          /> : 
        null
      }
    </div>
  )
}