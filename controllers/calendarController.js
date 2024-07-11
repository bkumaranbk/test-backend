const { google } = require('googleapis');
const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors')
app.use(cors())

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

// const calender = google.calendar({
//     version: "v3",
//     auth: process.env.API_KEY
// });

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const getAuthURL = (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.send({msg:'All SET'});
};

const handleOAuth2Callback = async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);

  console.log(tokens);
  oauth2Client.setCredentials(tokens);

  // Store the tokens in session or database
  req.session.tokens = tokens;

  console.log(tokens);
  res.send({
    msg: 'You have successfully logged in'
  });
};

const getFreeBusyIntervals = async (calendarId, timeMin, timeMax) => {
    try {
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
      const response = await calendar.freebusy.query({
        requestBody: {
          timeMin: timeMin,
          timeMax: timeMax,
          items: [{ id: calendarId }],
        },
      });
  
      const busyIntervals = response.data.calendars[calendarId].busy;
      return busyIntervals;
    } catch (error) {
      console.error('Error fetching free/busy intervals:', error);
      throw error;
    }
  };

  

module.exports = {
  getAuthURL,
  handleOAuth2Callback,
  getFreeBusyIntervals,
};
