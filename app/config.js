'use strict';

let config = {
    domain: 'proinsener.wildixin.com',
    timeout: 5 * 1000,

    responder: './responders/staticfiles/responder',
    responderConfig: {
        workinghours: './responders/staticfiles/workinghours.txt',
        nonworkinghours: './responders/staticfiles/nonworkinghours.txt'
    },

    xmppService: {
        service: 'xmpps://proinsener.wildixin.com',
        username: '777999',
        password: 'pass@777999'
    }
};

module.exports = config;
