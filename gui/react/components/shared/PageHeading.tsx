import {Link} from "react-router-dom";

interface IProps {
    children: React.ReactNode;
    links?: {
        title?: string;
        name: string;
        permission: string;
        link: string;
    }[];
}

const PageHeading = (props: IProps) => {

    return (
        <div className="border-b px-2 flex justify-between items-center">
            <span>{props.children}</span>
            <div className="flex gap-1">
                {props.links?.map(
                    (link) => (
                        <Link
                            key={link.name}
                            to={link.link}
                            className="hover:text-blue-500 hover:underline text-sm bg-blue-100 px-1 py-0.5"

                        >
                            {link.name}
                        </Link>
                    )
                )}
            </div>
        </div>
    );
};

export default PageHeading;
