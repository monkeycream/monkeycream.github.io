import './peerjs.js';
class MyPeer {
    constructor() {
        this.peer = new Peer({
            debug: 3,
            key: 'coseacaso001',
            host: '0.peerjs.com',
            secure: true
        });
        this.peer.on('call', (mediaConnection) => this.onCall);
        this.peer.on('close', this.onClose);
        this.peer.on('connection', this.onConnection);
        this.peer.on('disconnected', this.onDisconnected);
        this.peer.on('error', this.onError);
        this.peer.on('open', this.onOpen);
    }
    onCall() {
        console.log('onCall()');
    }
    onClose() {
        console.log('onClose()');
    }
    onConnection() {
        console.log('onConnection()');
    }
    onDisconnected() {
        console.log('onDisconnected()');
    }
    onError() {
        console.log('onError()');
    }
    onOpen() {
        console.log('onOpen()');
    }
}
export { MyPeer };
//# sourceMappingURL=peerman.js.map