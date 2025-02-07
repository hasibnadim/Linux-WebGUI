export interface INavItem {
    name: string;
    path: string;
}


const navValue: Array<INavItem> = [
   
    {
        name: "Software",
        path: "/"
    },
    {
        name: "Hardware",
        path: "/hardware",
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