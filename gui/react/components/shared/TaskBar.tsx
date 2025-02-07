import { Link } from "react-router-dom";
import style from "./style.module.scss";
import { cn } from "@/lib/utils";
import navValue from "@/resource/values/nav";
import { Expand, LayoutGrid, Menu, PanelRight } from "lucide-react";

const TaskBar = () => {
  return (
    <div className={style.taskbar}>
      <div className={cn(style.nav)}>
        <button className={cn(style.sidebar_btn)}>
          <PanelRight />
        </button>
        <Link to="/" className={style.logo}>
          <LayoutGrid />
        </Link>
        <p className={cn("sm:hidden", style.server_name)}> debian@localhost</p>
        <button
          className={cn(
            "inline-block sm:hidden ml-auto mr-2 text-white",
            style.menu_btn
          )}
        >
          <Menu />
        </button>
        <div className={cn(style.responsive)}>
          {navValue.map((v, i) => (
            <Link
              key={i}
              to={v.path}
              onClick={() => {
                document.title = v.name + " - LWG";
              }}
            >
              {v.name}
            </Link>
          ))}
        </div>
        <p className={cn("hidden sm:block", style.server_name)}>
          {" "}
          debian@localhost
        </p>
        <button
          className="ml-4 sm:ml-auto mr-2 text-white "
          onClick={() => {
            // fullscrin
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else document.documentElement.requestFullscreen();
          }}
        >
          <Expand size={15} />
        </button>
      </div>
    </div>
  );
};

export default TaskBar;
