import { Link } from "react-router-dom";
import style from "./style.module.scss";
import { cn } from "@/lib/utils";
import navValue from "@/resource/values/nav";
import { Expand, LayoutGrid } from "lucide-react";

const TaskBar = () => {
  return (
    <div className={style.taskbar}>
      <div className={cn(style.nav)}>
        <Link to="/" className={style.logo}>
          <LayoutGrid />
        </Link>
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
        <button
          className="ml-auto mr-2 text-white "
          onClick={() => {
            // fullscrin
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else document.documentElement.requestFullscreen();
          }}
        >
          <Expand />
        </button>
      </div>
    </div>
  );
};

export default TaskBar;
