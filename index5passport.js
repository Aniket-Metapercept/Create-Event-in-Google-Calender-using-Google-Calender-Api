// Require google from googleapis package.
const { google } = require('googleapis')

// Require oAuth2 from our google instance.
const { OAuth2 } = google.auth

// Create a new instance of oAuth and set our Client ID & Client Secret.
// const oAuth2Client = new OAuth2(
//     '882169501564-sqand4jd76eg9afh0j7hpi6kl2gdie8d.apps.googleusercontent.com','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'
// )
const oAuth2Client = new OAuth2(
    '1033549683997-g6hdcae9q5cvjc9pqtt98qquu4t4ojak.apps.googleusercontent.com','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'
)

// Call the setCredentials method on our oAuth2Client instance and set our refresh token.
oAuth2Client.setCredentials({
  // refresh_token: '1//04deCcZm249pKCgYIARAAGAQSNwF-L9IrIPLC5701gQNTJnYCiP9IEsCknDwfCern77Bn6NlP65CER2_GGiLXBSJMxWr3Z_NwhIQ',
  access_token:'ya29.A0ARrdaM-ovc5hku2yHa7IJAYuE9yIaSuH4mt2vpvVnx3q_MwZGXUDEiLJNpErgm2SBeF5yrr9219KVZ5QZI0Vd1EhjOWXhDGBjte69JdIUYcHnfOmbz0anGzE6bnp5_Q5zIJbKF7EhPTaJOkt4hcYW2U1lE72'
  // access_token:'ya29.A0ARrdaM-JNPquZ9i5gCCO1g6SvAkdVq_ibQJx2Kq7x5n6q0lFMFxnElmR42tDtIl-ppCWw_zJD5y230v8fZOxPOCmWELoKaWVAI7Qo1M6W28ChepX7_9hdZtsf5o8DT0KA5EoTuAwNqdKSK1QLbB__cktwSPS'
})

// Create a new calender instance.
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

// Create a new event start date instance for temp uses in our calendar.
const eventStartTime = new Date()
eventStartTime.setDate(eventStartTime.getDate() + 2)

// Create a new event end date instance for temp uses in our calendar.
const eventEndTime = new Date()
console.log(eventEndTime.getDate())
eventEndTime.setDate(eventEndTime.getDate() + 2)
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)

// Create a dummy event for temp uses in our calendar
const event = {
  summary: `sleeping`,
  location: `3595 California St, San Francisco, CA 94118`,
  description: `playing football with friends`,
  colorId: 1,
  start: {
    dateTime: eventStartTime,
    timeZone: 'America/Denver',
  },
  end: {
    dateTime: eventEndTime,
    timeZone: 'America/Denver',
  },
}


// Check if we a busy and have an event on our calendar for the same time.
calendar.freebusy.query(
  {
    resource: {
      timeMin: eventStartTime,
      timeMax: eventEndTime,
      timeZone: 'America/Denver',
      items: [{ id: 'primary' }],
    },
  },
  (err, res) => {
    // Check for errors in our query and log them if they exist.
    if (err) return console.error('Free Busy Query Error: ', err)

    // Create an array of all events on our calendar during that time.
    const eventArr = res.data.calendars.primary.busy
    console.log(eventArr)
    // Check if event array is empty which means we are not busy
    if (eventArr.length === 0)
      // If we are not busy create a new calendar event.
      return calendar.events.insert(
        { calendarId: 'primary', resource: event },
        err => {
          // Check for errors and log them if they exist.
          if (err) return console.error('Error Creating Calender Event:', err)
          // Else log that the event was created.
          return console.log('Calendar event successfully created.')
        }
      )

    // If event array is not empty log that we are busy.
    return console.log(`Sorry I'm busy...`)
  }
)