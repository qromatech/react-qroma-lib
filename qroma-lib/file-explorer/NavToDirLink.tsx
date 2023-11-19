import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";


interface INavToDirLinkProps {
  navToDirPath: string
}


export const NavToDirLink = (props: INavToDirLinkProps) => {
  const itemUrl = useBaseUrl("qroma-io/showQromaDir/#" + props.navToDirPath);
  
  return (
    <Link to={itemUrl}>{props.navToDirPath}</Link>
  )
}