export const onCardValidationChanged =(event)  => {
    console.log("CARD_VALIDATION_CHANGED: %o", event);
    payButton.disabled = !Frames.isCardValid();
  }

  export const onCardTokenized = event => {
    console.log("CARD_TOKENIZED: %o", event);
    const token = event.token;
    console.log(`card tokenized ${token}`)
  }
  
  export const onCardTokenizationFailed = error => {
    console.log("CARD_TOKENIZATION_FAILED: %o", error);
    Frames.enableSubmitForm();
  }
  
  export const onValidationChanged = event => {
    console.log("FRAME_VALIDATION_CHANGED: %o", event)
  }
  