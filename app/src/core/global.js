import {create} from 'zustand';
import secure from './secure';
import api, {ADDRESS} from './api';
import utils from './utils';

//-------------------------------------
//   Socket receive message handlers
//-------------------------------------

function responseThumbnail(set, get, data) {
  set(state => ({
    user: data,
  }));
}

const useGlobal = create((set, get) => ({
  initialized: false,

  init: async () => {
    const credentials = await secure.get('credentials');
    if (credentials) {
      try {
        const response = await api({
          method: 'POST',
          url: '/chat/signin/',
          data: {
            username: credentials.username,
            password: credentials.password,
          },
        });
        if (response.status !== 200) {
          throw 'Authentication error';
        }
        const user = response.data.user;
        const tokens = response.data.tokens;

        secure.set('tokens', tokens);

        set(state => ({
          initialized: true,
          authenticated: true,
          user: user,
        }));
        return;
      } catch (error) {
        console.log('useGlobal.init: ', error);
      }
    }
    set(state => ({
      initialized: true,
    }));
  },

  authenticated: false,
  user: {},
  login: (credentials, user, tokens) => {
    secure.set('credentials', credentials);
    secure.set('tokens', tokens);
    set(state => ({
      authenticated: true,
      user: user,
    }));
  },
  logout: () => {
    secure.wipe();
    set(state => ({
      authenticated: false,
      user: {},
    }));
  },

  //----------------------
  // WebSocket
  //----------------------

  socket: null,

  socketConnect: async () => {
    const tokens = await secure.get('tokens');

    const socket = new WebSocket(
      `ws://${ADDRESS}/chat/?token=${tokens.access}`,
    );
    socket.onopen = () => {
      utils.log('socket.onopen');
    };
    socket.onmessage = event => {
      // Convert data to javascript object
      const parsed = JSON.parse(event.data);

      // Debug log formatted  data
      utils.log('onmessage:', parsed);

      const responses = {
        // 'friend.list':     responseFriendList,
        // 'friend.new':      responseFriendNew,
        // 'message.list':    responseMessageList,
        // 'message.send':    responseMessageSend,
        // 'message.type':    responseMessageType,
        // 'request.accept':  responseRequestAccept,
        // 'request.connect': responseRequestConnect,
        // 'request.list':    responseRequestList,
        // 'search':          responseSearch,
        thumbnail: responseThumbnail,
      };
      const resp = responses[parsed.source];
      if (!resp) {
        utils.log('parsed.source "' + parsed.source + '" not found');
        return;
      }
      // Call response function
      resp(set, get, parsed.data);
    };
    socket.onerror = error => {
      utils.log('socket.onerror', error.message);
    };
    socket.onclose = () => {
      utils.log('socket.onclose');
    };
    set(state => ({
      socket: socket,
    }));
    utils.log('TOKENS', tokens);
  },

  socketClose: () => {
    const socket = get().socket;
    if (socket) {
      socket.close();
    }
    set(state => ({
      socket: null,
    }));
  },

  //---------------------
  //     Thumbnail
  //---------------------

  uploadThumbnail: file => {
    const socket = get().socket;
    socket.send(
      JSON.stringify({
        source: 'thumbnail',
        base64: file.base64,
        filename: file?.fileName,
      }),
    );
  },
}));

export default useGlobal;
