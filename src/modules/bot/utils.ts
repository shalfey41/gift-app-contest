import { BotError, GrammyError, HttpError } from 'grammy';
import { webcrypto } from 'crypto';

export const handleBotError = (error: unknown) => {
  if (!(error instanceof BotError)) {
    console.error('Unexpected error:', error);
    return;
  }

  const ctx = error.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);

  const e = error.error;

  if (e instanceof GrammyError) {
    console.error('Error in request:', e.description);
  } else if (e instanceof HttpError) {
    console.error('Could not contact Telegram:', e);
  } else {
    console.error('Unknown error:', e);
  }
};

export const getAvatarBackgroundColorByName = (name: string) => {
  let nameHash = Math.random();

  try {
    nameHash = Number(
      name
        .split('')
        .map((s) => s.charCodeAt(0))
        .join(''),
    );
  } catch (error: unknown) {
    console.error(`Couldn't create a hash for name ${name}`, error);
  }

  return (nameHash * 0xfffff * 1000000).toString(16).slice(0, 6);
};

export const isHashValid = async (data: Record<string, string>, token: string) => {
  const encoder = new TextEncoder();
  const secretKey = await webcrypto.subtle.importKey(
    'raw',
    encoder.encode('WebAppData'),
    { name: 'HMAC', hash: 'SHA-256' },
    true,
    ['sign'],
  );
  const secret = await webcrypto.subtle.sign('HMAC', secretKey, encoder.encode(token));
  const signatureKey = await webcrypto.subtle.importKey(
    'raw',
    secret,
    { name: 'HMAC', hash: 'SHA-256' },
    true,
    ['sign'],
  );

  const checkString = Object.keys(data)
    .filter((key) => key !== 'hash')
    .map((key) => `${key}=${data[key]}`)
    .sort()
    .join('\n');
  const signature = await webcrypto.subtle.sign('HMAC', signatureKey, encoder.encode(checkString));
  const hex = Buffer.from(signature).toString('hex');

  return data.hash === hex;
};
