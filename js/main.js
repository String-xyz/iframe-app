const CHANNEL = 'STRING_PAY'
let form = document.getElementById("payment-form");
import  * as events  from './events';
import axios from 'axios'

Frames.init("pk_test_8ac41c0d-fbcc-4ae3-a771-31ea533a2beb");

Frames.addEventHandler(
  Frames.Events.CARD_VALIDATION_CHANGED,
  events.onCardValidationChanged
);

Frames.addEventHandler(
  Frames.Events.FRAME_VALIDATION_CHANGED,
  events.onValidationChanged
);

Frames.addEventHandler(
  Frames.Events.CARD_TOKENIZATION_FAILED,
  events.onCardTokenizationFailed
);

Frames.addEventHandler(Frames.Events.CARD_TOKENIZED, 
  events.onCardTokenized
);

form.addEventListener("submit", function (event) {
  event.preventDefault();
  Frames.submitCard();
  sendEvent({message: "CardSubmited"},"cardSubmitted")
});

const  sendEvent = (message, eventType) =>  { 
  const message = JSON.stringify({
  channel: CHANNEL,
  data: {eventType, ...message},
  });
  window.parent.postMessage(message, '*');
}

