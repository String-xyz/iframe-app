const CHANNEL = 'STRING_PAY';
import {sendEvent, eventNames} from './events';

const Stringer = {
  currentPayload: undefined,
  init: () => { 
    Frames.init("pk_test_8ac41c0d-fbcc-4ae3-a771-31ea533a2beb");
    registerEventHandlers();
  },

  registerEventHandlers:() => {
    window.addEventListener('message', function (e) {
      const payload = JSON.parse(e.data);
      const channel = payload.channel;
      const event = payload.event
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
    
  },

  handleEvent: event => {
    switch (event.eventName) { 
        case "SUBMIT":
           currentPayload = event.payload;
           Frames.submit();
           events.onCardValidationChanged(event.isCardValid);
           break;
    }
  },

  onCardValidationChanged:event => {
    console.log("CARD_VALIDATION_CHANGED: %o", event);
    sendEvent(eventNames.CARD_VALIDATION_CHANGED,{isCardValid:Frames.isCardValid()})
  },
  
  onCardTokenized : event => {
    console.log("CARD_TOKENIZED: %o", event);
    const token = event.token;
    sendEvent(eventNames.CARD_TOKENIZED, {token});
    transact(token, currentPayload);
  },
  
  onCardTokenizationFailed: error => {
    console.log("CARD_TOKENIZATION_FAILED: %o", error);
    sendEvent(eventNames.CARD_TOKENIZATION_FAILED, {error});
    currentPayload = undefined;
    Frames.enableSubmitForm();
  },
  
  onValidationChanged: event => {
    console.log("FRAME_VALIDATION_CHANGED: %o", event);
  },

  transact: (token, payload) => { 

  }
  
}

const stringer = new Stringer();
stringer.init();
