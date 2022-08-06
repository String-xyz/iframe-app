import { eventNames } from "./events";

const CHANNEL = 'STRING_PAY';
const INTERNAL_URL = "http://localhost:8080/";

const sendEvent = (elem, eventName, data) => {
    const message = JSON.stringify({
        channel: CHANNEL,
        event: { eventName, ...data },
    });
    elem.contentWindow.postMessage(message, '*');
}

const Events = {
    onCardSubmitted: event => { },
    onCardFailed: event => { },
    onCardValidationChanged: event => { },
    onCardTokenized: event => { },
    onSubmit: event => { },
    onSubmitFailed: error => { },
}

const StringFrame = {
    apiKey: undefined,
    isCardValid: false,
    events: Events,
    stringElem: undefined,
    signature: undefined,
    init: apiKey => {
        this.apiKey = apiKey
        this.loadiFrame();
    },

    loadiFrame: () => {
        const container = document.querySelector(".string-pay-frame");
        if (!container) {
            console.error("Unable to load String Frame, element 'string-pay-frame' does not exist");
            return
        }

        const iframe = document.createElement('iframe');
        iframe.src = INTERNAL_URL;
        container.appendChild(iframe);
        this.stringElem = iframe;

        window.addEventListener('message', function (e) {
            const payload = JSON.parse(e.data);
            const channel = payload.channel;
            const event = payload.event
            if (channel == CHANNEL) {
                handleEvent(event)
            }
        });
    },

    handleEvent: event => {
        switch (event.eventName) {
            case eventNames.CARD_VALIDATION_CHANGED:
                this.isCardValid = event.isCardValid;
                this.events.onCardValidationChanged(event.isCardValid);
                break;
            case eventNames.CARD_TOKENIZED:
                this.events.onCardTokenized(event.token);
                break;
            case eventNames.CARD_TOKENIZATION_FAILED:
                this.events.onCardFailed(event.error);
                break;
            case eventNames.SUBMIT:
                this.events.onSubmit();
                break;
            case eventNames.SUBMIT_FAILED:
                this.events.onSubmitFailed(event.error)
        }
    },

    submit: (payload) => {
        sendEvent(stringElem, eventNames.SUBMIT,{ apiKey: apiKey, payload:payload})
    },
}

const stringFrame = new StringFrame();
window.StringFrame = stringFrame;