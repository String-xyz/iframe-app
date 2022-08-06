export const eventNames = { 
  CARD_VALIDATION_CHANGED: "CARD_VALIDATION_CHANGED",
  CARD_TOKENIZED:"CARD_TOKENIZED",
  CARD_TOKENIZATION_FAILED:"CARD_TOKENIZATION_FAILED",
  SUBMIT:"SUBMIT",
  SUBMIT_FAILED:"SUBMIT_FAILED",
  SIGN:"SIGN"
}

export const sendEvent = (eventName, data) => {
  const message = JSON.stringify({
    channel: CHANNEL,
    event: { eventName, ...data },
  });
  window.parent.postMessage(message, '*');
}
