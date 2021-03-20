import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';


class SendMailServices {

  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount()
    .then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      })

      this.client = transporter;
    })
  }

  async execute(to: string, subject: string, variables: object, path: string) {
    
    const templatefileContent = fs.readFileSync(path).toString("utf8");

    const mailTemplateParse = handlebars.compile(templatefileContent);
    const html = mailTemplateParse({variables})

    const message = await this.client.sendMail({
      to, 
      subject,
      html,
      from: "NPS <noreplay@nps.com.br>"
    })
    console.log("Message sent: %s", message.message);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}

export default new SendMailServices;
