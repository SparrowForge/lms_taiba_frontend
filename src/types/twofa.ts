export interface ITwofa {
    email:string ,
    code:string 
}

export enum TwofaStatus {
    ACTIVE="active",
    INACTIVE="inactive"
}

export interface TwoFaState {
    twoFaStatus: 'active' | 'inactive'
}

export interface IActionResponse{
    message:string
}