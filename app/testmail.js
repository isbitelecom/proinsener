const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: 'hotline@isbitelecom.com',
        pass: 'si@XJEaiE&BX&y5h'
    }
});

const mailOptions = {
    from: '"Chatbot Test" <hotline@isbitelecom.com>',
    to: 'admin@isbitelecom.com',
    subject: '📩 Prueba de envío desde Brevo + Nodemailer',
    text: 'Hola, este es un mensaje de prueba enviado desde un script Node.js usando Brevo (Sendinblue).'
};

transporter.sendMail(mailOptions)
    .then(() => {
        console.log("✅ Correo de prueba enviado con éxito.");
    })
    .catch((error) => {
        console.error("❌ Error al enviar el correo:", error.message);
    });
