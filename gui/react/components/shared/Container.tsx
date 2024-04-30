import { cn } from "@/lib/utils";
import React from "react";
import style from "./style.module.scss";
import { Outlet, useOutlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { INavItem } from "@/resource/values/nav.ts";

interface IContainer {
  children: React.ReactNode;
  menus: INavItem[];
  moduleTitle: string;
  moduleLink: string;
}

const Container = ({
  children,
  menus,
  moduleTitle,
  moduleLink,
}: IContainer) => {
  return (
    <div className={cn(style.container)}>
      <Sidebar
        sidebarMenus={menus}
        title={moduleTitle}
        moduleLink={moduleLink}
      />
      {children}
    </div>
  );
};
const ContainerCanvas = ({ children }: { children: React.ReactNode }) => {
  const isOutlet = useOutlet();

  return (
    <div className={cn(style.container_canvas)}>
      {isOutlet ? <Outlet /> : children}
    </div>
  );
};
Container.ContainerCanvas = ContainerCanvas;
export default Container;
