import axios from 'axios';
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
        case "TRANSACT":
           currentPayload = event.payload;
           Frames.submit();
           break;
           case "QUOTE":
            quote(event.payload);
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

  const transact = async (token, payload) => { 
    const data = {...payload, cardToken:token}
    try { 
      const resp = await axios.post('/transact', data)
      sendEvent(eventNames.TRANSACT, {data:resp.data})
      currentPayload = undefined
    } catch (error) { 
      sendEvent(eventNames.TRANSACT_FAILED, {error})
      currentPayload = undefined
    }
  };

  const quote = async (payload) => { 
    try { 
      const resp = await axios.post('/transact/quote', payload)
      sendEvent(eventNames.QUOTE, {data:resp.data})
    } catch (error) { 
      sendEvent(eventNames.QUOTE_FAILED, {error})
    }
  };
  
init();
