import PageHeading from "@/react/components/shared/PageHeading.tsx"; 
import React, { useEffect, useState } from "react";

interface IDisk {
    fileSystem: string;
    size: string;
    used: string;
    available: string;
    use: string;
    mountedOn: string;
  }
const Disk: React.FC = () => {
  const [disk, setDisk] = useState<IDisk[] | null>(null);
  const intervalRef = React.useRef<any>();
  useEffect(() => {
    window.io.on("_disk", (data: any) => {
        setDisk(data);
    });
    window.io.emit("disk");
    intervalRef.current = setInterval(() => {
      window.io.emit("disk");
    }, 1000*60*5);

    return () => {
      window.io.off("_disk");
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div>
      <PageHeading> Disk </PageHeading>
      {!disk ? (
        <div> Loading... </div>
      ) : (
        <table className="table-auto border-collapse border border-slate-500">
          <caption>Dik Useage</caption>
          <thead>
            <tr className="border border-slate-700">
              <th className="border border-slate-700">File System</th>
              <th className="border border-slate-700">Size</th>
              <th className="border border-slate-700">Used</th>
              <th className="border border-slate-700">Available</th>
              <th className="border border-slate-700 w-20">Use</th>
              <th className="border border-slate-700">Mounted On</th>
            </tr>
          </thead>
          <tbody>
            {disk.map((d, i) => (
              <tr key={i} className="border border-slate-700">
                <td className="border border-slate-700">{d.fileSystem}</td>
                <td className="border border-slate-700">{d.size}</td>
                <td className="border border-slate-700">{d.used}</td>
                <td className="border border-slate-700">{d.available}</td>
                <td className="border border-slate-700 w-20">
                    <div className="bg-cyan-600 font-bold" style={{width:d.use}}>
                    {d.use}
                    </div>
                </td>
                <td className="border border-slate-700">{d.mountedOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default Disk;
