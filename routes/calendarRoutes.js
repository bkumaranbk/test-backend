const express = require('express');
const {
  getAuthURL,
  handleOAuth2Callback,
  getFreeBusyIntervals,
} = require('../controllers/calendarController');

const router = express.Router();

router.get('/auth', getAuthURL);
router.get('/google/redirect', handleOAuth2Callback);

router.get('/freebusy', async (req, res) => {
  const calendarId = req.query.calendarId;
  const timeMin = req.query.timeMin;
  const timeMax = req.query.timeMax;

  if (!calendarId || !timeMin || !timeMax) {
    return res.status(400).send('Missing required parameters: calendarId, timeMin, timeMax');
  }

  try {
    const busyIntervals = await getFreeBusyIntervals(calendarId, timeMin, timeMax);
    res.json(busyIntervals);
  } catch (error) {
    console.error('Error fetching free/busy intervals:', error);
    res.status(500).send('Error fetching free/busy intervals');
  }
});

module.exports = router;
