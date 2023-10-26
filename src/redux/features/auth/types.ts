export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface InitialState {
    token: string | null;
    user: User | null;
}