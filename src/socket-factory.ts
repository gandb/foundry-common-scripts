
import {commonSocket } from "./common-socket-socketlib";
import {Socket} from "./common-socket";

class SocketFactory{
    public  getSocket(): Socket{
        return commonSocket;
    }
}

export const socketFactory = new SocketFactory();
 