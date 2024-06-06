export interface User {
    token?: string
    user?: string
}

export interface Register {
    emailaddress: string;
    password: string;
}

export interface Login {
    userName: string;
    password: string;
}