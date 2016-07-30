import io from 'socket.io-client';

// Socket's communication service
export default class {
  constructor($rootScope, user, auth) {
    this.$rootScope = $rootScope;
    this.user = user;
    this.auth = auth;
    this.socket = null;

    this._init();
  }

  _init() {
    this.$rootScope.$on(this.user.AUTH_EVENTS.logoutSuccess, () => this.disconnect());
    this.$rootScope.$on(this.user.AUTH_EVENTS.forbidden, () => this.disconnect());
  }

  // Coonect the client via web sockets
  connect() {
    if (this.socket && this.socket.connected) {
      return;
    }

    this.socket = io.connect({
      reconnection: true,
      query: {
        token: 'Bearer ' + this.auth.getToken()
      }
    });

    this.socket.on('connect', () => {
      // Handle server's socket events fired
      this.socket.on('taskCompleted', () => {
        this.$rootScope.$broadcast('auctionCompleted');
      });

       this.socket.on('taskUpdated', (data) => {
        this.$rootScope.$broadcast('auctionUpdated', data);
      });

      this.socket.on('taskStarted', (data) => {
        this.$rootScope.$broadcast('auctionStarted', data);
      });

      this.socket.on('allTasksCompleted', () => {
        this.$rootScope.$broadcast('allAuctionsCompleted');
      });

      this.socket.on('forceDisconnect', () => {
        this.user.silentLogout();
        this.disconnect();
      });
    });
  }

  // Disconnect web socket's connection
  disconnect() {
    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }
  }
}