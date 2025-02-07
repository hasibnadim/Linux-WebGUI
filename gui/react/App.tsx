import { connectIo } from "@/socket/io";
import { useState } from "react";
import { Outlet, RouterProvider, useOutlet } from "react-router-dom";
import routes from "@/react/routes.tsx";
import TaskBar from "@/react/components/shared/TaskBar";
import Login from "./components/Login";
import style from "./components/shared/style.module.scss";
import { cn } from "@/lib/utils";
export const RootRouter = () => {
  const [ioConnected, setIoConnected] = useState(false);
  const isOutlet = useOutlet();
  const [errorMsg, setErrorMsg] = useState("");

  if (!ioConnected) {
    return (
      <div>
        <Login
          errorMsg={errorMsg}
          setSSHCradintials={(credentials) => {
            connectIo({
              setIOBool: setIoConnected,
              setErrorMsg,
              credentials,
            });
          }}
        />
      </div>
    );
  }
  return (
    <>
      <TaskBar />
      {isOutlet ? (
        <Outlet />
      ) : (
        <div className={cn(style.container, "bg-blue-950 text-white")}>
          <h1 className="text-3xl m-4 text-center w-full">
            Welcome to Linux WebGUI
          </h1>
        </div>
      )}
      {/*<Toaster/>*/}
    </>
  );
};
const App = () => {
  return <RouterProvider router={routes()} />;
};

export default App;
