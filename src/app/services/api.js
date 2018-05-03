import 'isomorphic-fetch';
import * as asyncModule from '../utils/asyncModule';

// https://github.com/redux-saga/redux-saga/blob/master/examples/real-world/services/api.js

const API_ROOT = process.env.API_ROOT;
const API_SCHEME = process.env.API_SCHEME;
const WS_SCHEME = process.env.WS_SCHEME;

export function fetchCard() {
  return fetch(`${API_SCHEME}://${API_ROOT}games/card`, {
    mode: 'cors',
  })
    .then(asyncModule.checkStatus)
    .then(asyncModule.parseJSON)
    .then((card) => ({ card }))
    .catch((error) => ({ error }));
}

export function connectWS(answer) {
  const ws = new WebSocket(`${WS_SCHEME}://${API_ROOT}games/ws/event`, [answer]);

  // Todo error handling.

  ws.onopen = () => {
    console.log('Connected');
  };

  ws.onerror = (error) => {
    console.log(`WebSocket error ${error}`);
    return {};
  };

  return ws;
}

export function sendAnswer(wsConn, answer) {
  return new Promise((resolve) => {
    wsConn.onmessage = (e) => {
      let msg = null;
      try {
        msg = JSON.parse(e.data);
      } catch (error) {
        console.error(`Error parsing : ${e.data}`);
      }
      resolve(msg);
    };

    wsConn.send(
      JSON.stringify({
        number: answer
      })
    );
  });
}
