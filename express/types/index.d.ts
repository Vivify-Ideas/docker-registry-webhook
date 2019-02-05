import { User } from "../modules/user/typings";

interface UserToken {
    email: string
}

declare global {
    namespace Express {
       export interface Request {
           user?: UserToken
       }
    }
    namespace SocketIO {
        export interface Server {
            user?: UserToken
        }
    }
}
