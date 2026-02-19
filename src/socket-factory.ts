//import { socketLibImplementation as socketImplemantion} from "./common-socket-socketlib";
import { chatSocketImplementation  as socketImplemantion} from "./common-socket-chatmessage";
import {Socket} from "./common-socket";

class SocketFactory{
    public  getSocket(): Socket{
        return socketImplemantion;
    }
}

export const socketFactory = new SocketFactory();