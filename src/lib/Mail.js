import nodemailer from 'nodemailer';
import path from 'path';
import nodemailerHBS from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });
    this.configureTemplate();
  }

  configureTemplate() {
    const viewPath = path.resolve(__dirname, '..', 'app', 'views', 'emails');

    const options = {
      viewEngine: {
        layoutsDir: path.resolve(viewPath, 'layouts'),
        partialsDir: path.resolve(viewPath, 'partials'),
        defaultLayout: 'template',
        extname: '.hbs',
      },
      viewPath,
      extName: '.hbs',
    };
    this.transporter.use('compile', nodemailerHBS(options));
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}
export default new Mail();
