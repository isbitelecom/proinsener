'use strict';

const nodemailer = require('nodemailer');

class Responder {
    constructor(config) {
        this.config = config;

        this.mailer = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true,
            auth: {
                user: 'hotline@isbitelecom.com',
                pass: 'si@XJEaiE&BX&y5h'
            }
        });

        this.awaitingResponse = new Map();
    }

    isClosedNow() {
        const now = new Date();
        const hour = now.getHours();
        return hour >= 11 && hour < 14; // cerrado entre 11:00 y 12:00
    }

    async hello(from) {
        if (this.isClosedNow()) {
            this.awaitingResponse.set(from, true);
            return `👋 ¡Hola! Actualmente estamos fuera del horario de atención (entre las 11:00 y las 12:00).

Por favor, déjanos tus datos de contacto:
- 👤 Nombre
- 📧 Correo electrónico
- 📞 Teléfono
- 📝 Solicitud`;
        } else {
            return null;
        }
    }

    async say(from, text) {
        if (this.awaitingResponse.has(from)) {
            this.awaitingResponse.delete(from);

            try {
                await this.mailer.sendMail({
                    from: 'hotline@isbitelecom.com',
                    to: 'admin@isbitelecom.com',
                    subject: '💬 Nuevo mensaje desde el chatbot (fuera de horario)',
                    text: `Mensaje recibido fuera de horario:
De: ${from}
Contenido:
${text}`
                });
                return `✅ Tu mensaje ha sido enviado con éxito. Cerraremos el chat ahora. ¡Gracias y hasta pronto!`;
            } catch (error) {
                console.error("❌ Error al enviar el correo:", error.message);
                return `⚠️ Ha ocurrido un error al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.`;
            }
        }
        return null;
    }
}

module.exports = Responder;
