'use strict';

const xml = require('@xmpp/xml');
const logger = require('./utils/logger.js');
const config = require('./config');

logger.debug({ config });

const XmppClient = require('./xmpp/client');
const KiteManager = require('./xmpp/kite');
const BotResponder = require(config.responder);

const timeout = config.timeout || 5 * 1000;
const xmpp = new XmppClient(config.domain, config.xmppService, timeout, logger);
const responder = new BotResponder(config.responderConfig);
const kite = new KiteManager(xmpp, config.domain, responder, timeout, logger);

// 🔁 Fonction qui vérifie si on est dans les horaires de fermeture
function isClosedNow() {
    const now = new Date();
    const hour = now.getHours();

    // Fermé tous les jours entre 11h00 et 12h00
    return hour >= 11 && hour < 12;
}

// 🔌 Connexion à XMPP
xmpp.connect()
    .then(() => {
        logger.info('✅ Bot connecté avec succès à XMPP');

        if (isClosedNow()) {
            logger.info('⏰ En horaire de fermeture — envoi de présence');
            xmpp.client.send(xml('presence'));
        } else {
            logger.info('🟢 En horaire d’ouverture — le bot reste silencieux');
        }
    })
    .catch(err => {
        logger.error(err.toString());
    });

// 🔍 Réception des messages
xmpp.on('message', async ({ from, to, id, message }) => {
    const loggerData = {
        msg: {
            from: from.toString(),
            to: to.toString(),
            messageId: id
        }
    };

    logger.info(loggerData, 'New message from Kite');

    kite.processMessage(from, to, id, message)
        .then((msgid) => {
            logger.info({ ...loggerData, msgid }, '✅ Message traité');
        })
        .catch((error) => {
            logger.error({ ...loggerData, error: error.toString() }, '❌ Échec traitement message');
        });
});

// 🧹 Fermeture propre du bot
function gracefulExit(signal) {
    logger.info('⛔ Signal reçu :', signal);

    return xmpp.stop()
        .then(() => process.exit())
        .catch(err => {
            logger.error(err.toString());
            process.exit();
        });
}

process.on('SIGINT', gracefulExit);
process.on('SIGTERM', gracefulExit);
