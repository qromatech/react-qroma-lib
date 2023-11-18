import React from "react";


interface IOpenContentsLinkProps {
  itemPath: string
}


export const OpenContentsLink = (props: IOpenContentsLinkProps) => {
  console.log(props.itemPath)
  const itemUrl = "./showQromaFile/#" + props.itemPath;
  return (
    <a href={itemUrl}>
      {props.itemPath}
    </a>
  )
}