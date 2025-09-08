const nodemailer = require('nodemailer');


function EnviarEmail(email, senha){
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'gabriel.gcd08@gmail.com',
            pass: 'qisfjtznxanyrdhd'
        }
    });

    let mailOptions = {
        from: 'gabriel.gcd08@gmail.com',
        to: email,
        subject: 'Senha Integra',
        text: 'A sua senha do Integra é: ' + senha,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(JSON.stringify({'erro': error}));
        }
        return console.log(JSON.stringify({'Email enviado: ': info.response}));
    });
}

module.exports = {EnviarEmail};