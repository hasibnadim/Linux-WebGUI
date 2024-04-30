import PageHeading from "@/react/components/shared/PageHeading.tsx";
import React, { useEffect, useState } from "react";

interface ICPU {
    Architecture: string;
    "CPU op-mode(s)": string;
    "Byte Order": string;
    "CPU(s)": string;
    "On-line CPU(s) list": string;
    "Thread(s) per core": string;
    "Core(s) per socket": string;
    "Socket(s)": string;
    "NUMA node(s)": string;
    Vendor: string;
    Model: string;
    "CPU family": string;
    "Model name": string;
    "Stepping": string;
    "CPU MHz": string;
    "BogoMIPS": string;
    "Hypervisor vendor": string;
    "Virtualization type": string;
    "L1d cache": string;
    "L1i cache": string;
    "L2 cache": string;
    "L3 cache": string;
    "NUMA node0 CPU(s)": string;
    "Flags": string;
}
const CPU: React.FC = () => {
  const [cpu, setCpu] = useState<ICPU | null>(null);
  const intervalRef = React.useRef<any>();
  useEffect(() => {
    window.io.on("_cpu", (data: any) => {
        setCpu(data);
    });
      window.io.emit("cpu");
    // intervalRef.current = setInterval(() => {
    //   window.io.emit("@cpu");
    // }, 2000);

    return () => {
      window.io.off("_cpu");
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div>
      <PageHeading> CPU </PageHeading>
      {!cpu ? (
        <div> Loading... </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
            <div>
                <h2>Architecture</h2>
                <p>{cpu.Architecture}</p>
            </div>
            <div>
                <h2>CPU op-mode(s)</h2>
                <p>{cpu["CPU op-mode(s)"]}</p>
            </div>
            <div>
                <h2>Byte Order</h2>
                <p>{cpu["Byte Order"]}</p>
            </div>
            <div>
                <h2>CPU(s)</h2>
                <p>{cpu["CPU(s)"]}</p>
            </div>
            <div>
                <h2>On-line CPU(s) list</h2>
                <p>{cpu["On-line CPU(s) list"]}</p>
            </div>
            <div>
                <h2>Thread(s) per core</h2>
                <p>{cpu["Thread(s) per core"]}</p>
            </div>
            <div>
                <h2>Core(s) per socket</h2>
                <p>{cpu["Core(s) per socket"]}</p>
            </div>
            <div>
                <h2>Socket(s)</h2>
                <p>{cpu["Socket(s)"]}</p>
            </div>
            <div>
                <h2>NUMA node(s)</h2>
                <p>{cpu["NUMA node(s)"]}</p>
            </div>
            <div>
                <h2>Vendor</h2>
                <p>{cpu.Vendor}</p>
            </div>
            <div>
                <h2>Model</h2>
                <p>{cpu.Model}</p>
            </div>
            <div>
                <h2>CPU family</h2>
                <p>{cpu["CPU family"]}</p>
            </div>
            <div>
                <h2>Model name</h2>
                <p>{cpu["Model name"]}</p>
            </div>
            <div>
                <h2>Stepping</h2>
                <p>{cpu["Stepping"]}</p>
            </div>
            <div>
                <h2>CPU MHz</h2>
                <p>{cpu["CPU MHz"]}</p>
            </div>
            <div>
                <h2>BogoMIPS</h2>
                <p>{cpu["BogoMIPS"]}</p>
            </div>
        </div>
      )}
    </div>
  );
};
export default CPU;
