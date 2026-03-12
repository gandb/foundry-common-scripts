// import { socketLibImplementation as socketImplemantion} from "./implementations/common-socket-socketlib";
 //import { chatSocketImplementation  as socketImplemantion} from "./implementations/common-socket-chatmessage";
 import { dummySocketImplementation  as socketImplemantion} from "./implementations/common-socket-dummy";
import {Socket} from "./common-socket";

class SocketFactory{
    public  getSocket(): Socket{
        return socketImplemantion;
    }
}

export const socketFactory = new SocketFactory();