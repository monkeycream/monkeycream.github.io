//import Peer = require('peerjs');
import { MyPeer } from './peerman.js';
class App {
    constructor() {
        console.log('App created');
        //this.peer = new MyPeer();
    }
    init() {
        this.peer = new MyPeer();
    }
}
export { App };
//# sourceMappingURL=app.js.map