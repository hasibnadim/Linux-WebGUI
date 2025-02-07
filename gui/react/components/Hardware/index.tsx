import { Route } from "react-router-dom";
import Container from "../shared/Container";
import { INavItem } from "@/resource/values/nav.ts";
import Memory from "@/react/components/Hardware/Memory";
import NotFound from "@/react/components/NotFound";
import CPU from "./Cpu";
import Disk from "./Disk";

export const hardwareMenus: INavItem[] = [
  {
    path: "cpu",
    name: "CPU",
  },
  {
    path: "mem_ram",
    name: "Memory/RAM",
  },
  {
    path: "disk",
    name: "Disk/Storage",
  },
  {
    path: "devices",
    name: "Devices",
  },
];

export const hardwareRoutes = () => (
  <>
    <Route path="mem_ram" element={<Memory />} />
    <Route path="cpu" element={<CPU />} />
    <Route path="disk" element={<Disk />} />
    <Route path="*" element={<NotFound />}></Route>
  </>
);

const Hardware = () => {
  return (
    <Container
      menus={hardwareMenus}
      moduleTitle="Hardware"
      moduleLink="hardware"
    >
      <Container.ContainerCanvas>
        <div className="h-[1000px]">default view</div>
      </Container.ContainerCanvas>
    </Container>
  );
};

export default Hardware;
