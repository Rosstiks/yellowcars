// Netlify Form submission → Telegram notification
// Requires env vars: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

export const handler = async (event) => {
  try {
    const payload = JSON.parse(event.body || '{}');
    const { payload: formPayload } = payload;
    const data = formPayload?.data || {};
    const formName = formPayload?.form_name || 'contact';

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) {
      console.warn('Telegram env vars are missing');
      return { statusCode: 200, body: 'Env not configured' };
    }

    const name = data.name || '-';
    const phone = data.phone || '-';
    const message = data.message || '-';
    const text = [
      `🟡 Новая заявка (${formName})` ,
      `Имя: ${name}`,
      `Телефон: ${phone}`,
      `Сообщение: ${message}`
    ].join('\n');

    const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    return { statusCode: 200, body: 'OK' };
  } catch (e) {
    console.error('submission-created error', e);
    return { statusCode: 200, body: 'Handled' };
  }
};


