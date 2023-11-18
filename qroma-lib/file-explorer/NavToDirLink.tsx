import React from "react";


interface INavToDirLinkProps {
  navToDirPath: string
}


export const NavToDirLink = (props: INavToDirLinkProps) => {
  const itemUrl = "./showQromaDir/#" + props.navToDirPath;
  return (
    <a href={itemUrl}>
      {props.navToDirPath}
    </a>
  )
}