import {sendEvent, eventNames} from './events';
const CHANNEL = 'STRING_PAY';
const CHECKOUT_PUB_KEY = process.env.CHECKOUT_PUB_KEY;
  const init = () => { 
    Frames.init(CHECKOUT_PUB_KEY);
    registerEventHandlers();
  };

  const registerEventHandlers = () => {
    window.addEventListener('message', function (e) {
      const payload = e.data;
      const channel = payload.channel;
      const event = payload.event;
      if (channel == CHANNEL) {
          handleEvent(event)
      }
    });

    Frames.addEventHandler(
      Frames.Events.CARD_VALIDATION_CHANGED,
      onCardValidationChanged
    );
    
    Frames.addEventHandler(
      Frames.Events.FRAME_VALIDATION_CHANGED,
      onValidationChanged
    );
    
    Frames.addEventHandler(
      Frames.Events.CARD_TOKENIZATION_FAILED,
      onCardTokenizationFailed
    );
    
    Frames.addEventHandler(Frames.Events.CARD_TOKENIZED,
      onCardTokenized
    );
    
  };

  const handleEvent = event => {
    switch (event.eventName) { 
        case "SUBMIT":
           currentPayload = event.payload;
           Frames.submit();
           events.onCardValidationChanged(event.isCardValid);
           break;
    }
  };

  const onCardValidationChanged = event => {
    console.log("CARD_VALIDATION_CHANGED: %o", event);
    sendEvent(eventNames.CARD_VALIDATION_CHANGED,{isCardValid:Frames.isCardValid()})
  };
  
  const onCardTokenized = event => {
    console.log("CARD_TOKENIZED: %o", event);
    const token = event.token;
    sendEvent(eventNames.CARD_TOKENIZED, {token});
    transact(token, currentPayload);
  };
  
  const onCardTokenizationFailed = error => {
    console.log("CARD_TOKENIZATION_FAILED: %o", error);
    sendEvent(eventNames.CARD_TOKENIZATION_FAILED, {error});
    currentPayload = undefined;
    Frames.enableSubmitForm();
  };
  
  const onValidationChanged = event => {
    console.log("FRAME_VALIDATION_CHANGED: %o", event);
  };

  const transact = (token, payload) => { 

  };
  
init();
