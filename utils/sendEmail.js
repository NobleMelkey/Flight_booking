// utils/sendEmail.js

const sgMail = require('@sendgrid/mail');
const ejs = require('ejs');
const pdf = require('pdfkit');
const fs = require('fs');
const path = require('path');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (booking) => {
  try {
    const html = await ejs.renderFile(path.join(__dirname, '../templates/booking.ejs'), { booking });
    
    const doc = new pdf();
    const filePath = path.join(__dirname, `../pdfs/booking-${booking._id}.pdf`);
    doc.pipe(fs.createWriteStream(filePath));
    doc.text(html);
    doc.end();
    
    const msg = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Flight Booking Confirmation',
      text: `Your booking details: Flight Number: ${booking.flightNumber}, Passenger Name: ${booking.passengerName}, Departure Date: ${booking.departureDate}, Seat Number: ${booking.seatNumber}`,
      attachments: [
        {
          content: fs.readFileSync(filePath).toString('base64'),
          filename: `booking-${booking._id}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    };

    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
