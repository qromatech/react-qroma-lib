import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";


interface IShowQromaFileLinkProps {
  itemPath: string
}


export const ShowQromaFileLink = (props: IShowQromaFileLinkProps) => {
  console.log(props.itemPath)
  const itemUrl = useBaseUrl("qroma-io/showQromaFile/#" + props.itemPath);

  return (
    <Link to={itemUrl}>{props.itemPath}</Link>
  )
}