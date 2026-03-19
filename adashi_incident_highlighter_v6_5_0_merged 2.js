const fetch = require('node-fetch');

const GROUPME_BOT_ID = 'c64f2794b52f1f1859517fdfd5';
const URL = 'https://live.adashi.com/bcfd/';

let seen = new Set();

async function sendToGroupMe(text) {
  await fetch('https://api.groupme.com/v3/bots/post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bot_id: GROUPME_BOT_ID,
      text
    })
  });
}

async function checkAdashi() {
  try {
    const res = await fetch(URL);
    const html = await res.text();

    const rows = html.match(/<tr.*?>.*?<\/tr>/gs);
    if (!rows) return;

    rows.forEach(row => {
      const idMatch = row.match(/F\d+/);
      if (!idMatch) return;

      const id = idMatch[0];

      if (seen.has(id)) return;
      seen.add(id);

      const clean = row.replace(/<[^>]+>/g, ' ').trim();

      sendToGroupMe(`🚒 NEW INCIDENT\n${clean}`);
    });

  } catch (err) {
    console.log(err);
  }
}

setInterval(checkAdashi, 3000);