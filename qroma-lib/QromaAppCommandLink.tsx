import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";


interface IQromaAppCommandLinkProps {
  commandAsBase64: string
}


export const QromaAppCommandLink = (props: IQromaAppCommandLinkProps) => {
  const itemUrl = useBaseUrl("qroma-io/sendAppMessage/#/" + props.commandAsBase64);
  
  return (
    <Link to={itemUrl}>{props.commandAsBase64}</Link>
  )
}