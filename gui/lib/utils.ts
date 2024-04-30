import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import uuid4 from "uuid4"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


let uid = 0;
export const getUid = (prefix = "") => {
    return `${prefix}${++uid}`;
};


export const getUUid = (prefix = "") => {
    return `${getUid(prefix)}${uuid4()}`;
};