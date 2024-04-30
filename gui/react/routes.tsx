import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { RootRouter } from "@/react/App.tsx";
import Hardware, { hardwareRoutes } from "@/react/components/Hardware";

const routes = () =>
  createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootRouter />}>
        <Route path={"/hardware"} element={<Hardware />}>
          {hardwareRoutes()}
        </Route>
        <Route path="*" element={<div>Not Found</div>}></Route>
      </Route>
    )
  );
export default routes;
