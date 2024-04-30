import {cn} from "@/lib/utils";
import style from "./style.module.scss";
import {useState} from "react";
import {Link} from "react-router-dom";
import {FolderClosed, FolderOpen, Box} from "lucide-react";
import {INavItem} from "@/resource/values/nav.ts";
export interface ISidebarItem extends INavItem{
    children?: ISidebarItem[];
}
interface ISidebarProps {
    sidebarMenus: ISidebarItem[];
    title: string;
    moduleLink: string;
}

interface IMenuItemProps {
    menu: ISidebarItem;
    pvPath?: string;
}

const MenuItem = ({menu, pvPath = ""}: IMenuItemProps) => {
    const [showMenu, setShowMenu] = useState(false);

    function setTitle() {
        if (menu.name) {
            document.title = `${menu.name} - LWG`;
        }
        setShowMenu(true);
    }

    return (
        <li>
            <p className="flex justify-start items-center text-sm">
                <button className="mx-1">
                    {menu.children ? (
                        <>
                            {showMenu ? (
                                <FolderOpen size={15} onClick={() => setShowMenu((_) => !_)}/>
                            ) : (
                                <FolderClosed
                                    size={15}
                                    onClick={() => setShowMenu((_) => !_)}
                                />
                            )}
                        </>
                    ) : (
                        <Box size={15}/>
                    )}
                </button>
                <Link
                    to={`/${pvPath}/${menu.path}`}
                    className="hover:underline"
                    onClick={setTitle}
                >
                    {menu.name}
                </Link>
            </p>
            {menu.children && showMenu && (
                <ul className="pl-4">
                    {menu.children.map((m1, indx) => (
                        <MenuItem
                            menu={m1}
                            pvPath={`${pvPath}/${menu.path}`}
                            key={`Sidebar_${indx}`}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

const Sidebar = (props: ISidebarProps) => {
    return (
        <div className={cn(style.sidebar)}>
            <p className="font-semibold font-sans border-b mb-2 text-center">
                {props.title}
            </p>
            <ul>
                {props.sidebarMenus.map((menu, idx) => (
                    <MenuItem menu={menu} pvPath={props.moduleLink} key={idx}/>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
