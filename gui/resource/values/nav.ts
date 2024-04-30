export interface INavItem {
    name: string;
    path: string;
}


const navValue: Array<INavItem> = [
    {
        name: "Hardware",
        path: "/hardware",
    },
    {
        name: "Software",
        path: "/"
    },
    {
        name: "File Manager",
        path: "/"
    },
    {
        name: "Network",
        path: "/"
    },
    {
        name: "Security",
        path: "/"
    },
];
export default navValue;