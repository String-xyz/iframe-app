import { ethers } from "ethers";
import { eventNames } from "./events";

const CHANNEL = 'STRING_PAY';
const INTERNAL_URL = "https://iframe-app.dev.string-api.xyz/";

const sendEvent = (elem, eventName, data) => {
    if (!elem) {
        console.error("String element not defined");
        throw new Error("String element not defined");
    }
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
        apiKey = apiKey
        loadiFrame();
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
        stringElem = iframe;

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
                isCardValid = event.isCardValid;
                events.onCardValidationChanged(event.isCardValid);
                break;
            case eventNames.CARD_TOKENIZED:
                events.onCardTokenized(event.token);
                break;
            case eventNames.CARD_TOKENIZATION_FAILED:
                events.onCardFailed(event.error);
                break;
            case eventNames.SUBMIT:
                events.onSubmit();
                break;
            case eventNames.SUBMIT_FAILED:
                events.onSubmitFailed(event.error)
        }
    },
    submit: async (payload) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        try { 
            const signature = await signer.signMessage("hello");
            sendEvent(stringElem, eventNames.SUBMIT, { apiKey: apiKey, payload: payload })
        } catch(error) { 
            console.error(error)
        }
    },
}

window.StringFrame = StringFrame;
