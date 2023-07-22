import React, { useState } from "react"
import { FieldInfo } from "@protobuf-ts/runtime"
import { MessageAllFieldsDetailsComponent } from "./MessageAllFieldsDetailsComponent";


interface IMessageDetailsComponentProps {
  typeName: string
  fields: readonly FieldInfo[]
}


export const MessageDetailsComponent = (props: IMessageDetailsComponentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const ExpansionButton = () => {
    return <button onClick={() => setIsExpanded(!isExpanded)}>
      {isExpanded ? '-' : '+'}
    </button>
  }

  
  return (
    <div>
      <ExpansionButton />{props.typeName}
      {isExpanded ? 
        <>
          <MessageAllFieldsDetailsComponent
            messageTypeName={props.typeName}
            fields={props.fields}
            />
          <button onClick={() => {console.log("Make Request")}}>Make Request</button>
        </>
 : 
        null
      }
    </div>
  )
}