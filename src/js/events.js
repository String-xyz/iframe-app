export const eventNames = { 
  CARD_VALIDATION_CHANGED: "CARD_VALIDATION_CHANGED",
  CARD_TOKENIZED:"CARD_TOKENIZED",
  CARD_TOKENIZATION_FAILED:"CARD_TOKENIZATION_FAILED",
  TRANSACT:"TRANSACT",
  TRANSACT_FAILED:"TRANSACT_FAILED",
  QUOTE:"QUOTE",
  QUOTE_FAILED:"QUOTE_FAILED",
  SIGN:"SIGN"
}

export const sendEvent = (eventName, data) => {
  const message = JSON.stringify({
    channel: CHANNEL,
    event: { eventName, payload:data },
  });
  window.parent.postMessage(message, '*');
}
