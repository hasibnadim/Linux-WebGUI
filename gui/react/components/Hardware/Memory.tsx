import PageHeading from "@/react/components/shared/PageHeading.tsx";
import React, { useEffect, useState } from "react";
interface IMemeory {
  unit: string;
  total: number;
  used: number;
  free: number;
  swapTotal: number;
  swapUsed: number;
  swapFree: number;
  shared: number;
  buffers: number;
  cached: number;
  physical: Record<string, string>;
}
const Memory: React.FC = () => {
  const [memory, setMemory] = useState<IMemeory | null>(null);
  const intervalRef = React.useRef<any>();
  useEffect(() => {
    window.io.on("_memory", (data: any) => {
      setMemory(data);
    });
    window.io.emit("memory");
    intervalRef.current = setInterval(() => {
      window.io.emit("memory");
    }, 2000);

    return () => {
      window.io.off("_memory");
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div>
      <PageHeading> Memory / RAM </PageHeading>
      {!memory ? (
        <div> Loading... </div>
      ) : (
        <>
          <table className="table-auto border-collapse border border-slate-500">
            <caption>Memory Useage</caption>
            <thead>
              <tr className="border border-slate-700">
                <th className="border border-slate-700">Total</th>
                <th className="border border-slate-700">Used</th>
                <th className="border border-slate-700">Free</th>
                <th className="border border-slate-700">Swap Total</th>
                <th className="border border-slate-700">Swap Used</th>
                <th className="border border-slate-700">Swap Free</th>
                <th className="border border-slate-700">Cached</th>
                <th className="border border-slate-700">Shared</th>
                <th className="border border-slate-700">Buffers</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border border-slate-700">
                <td className="border border-slate-700">{memory.total}</td>
                <td className="border border-slate-700">{memory.used}</td>
                <td className="border border-slate-700">{memory.free}</td>
                <td className="border border-slate-700">{memory.swapTotal}</td>
                <td className="border border-slate-700">{memory.swapUsed}</td>
                <td className="border border-slate-700">{memory.swapFree}</td>
                <td className="border border-slate-700">{memory.cached}</td>
                <td className="border border-slate-700">{memory.shared}</td>
                <td className="border border-slate-700">{memory.buffers}</td>
              </tr>
            </tbody>
          </table>
          <hr />
          <table>
            <caption>Physical Memory</caption>
            <tbody>
              {Object.entries(memory.physical).map(([key, value]) => (
                <tr key={key} className="border border-slate-700">
                  <td className="border border-slate-700">{key}</td>
                  <td className="border border-slate-700">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
export default Memory;
