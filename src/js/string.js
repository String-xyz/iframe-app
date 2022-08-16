import { ethers } from "ethers";
import { eventNames } from "./events";

const CHANNEL = 'STRING_PAY';
const INTERNAL_URL = process.env.INTERNAL_URL;

const sendEvent = (elem, eventName, data) => {
    if (!elem) {
        console.error("String element not defined");
        throw new Error("String element not defined");
    }
    const message = JSON.stringify({
        channel: CHANNEL,
        event: { eventName, payload: data },
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
            const payload = e.data;
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

    transact: async (payload) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const signer = provider.getSigner();
        try {
            const signature = await signer.signMessage("hello");
            sendEvent(stringElem, eventNames.TRANSACT, { apiKey: apiKey, payload: payload })
        } catch (error) {
            console.error(error)
        }
    },

    quote: (payload = testData) => {
        sendEvent(stringElem, eventNames.QUOTE, { apiKey: apiKey, payload: payload })
    }
}

window.StringFrame = StringFrame;

// remove once ready
testData = { 
		chainID: 43113,
		userAddress: '0x44A4b9E2A69d86BA382a511f845CbF2E31286770',
		contractAddress: '0x861af9ed4fee884e5c49e9ce444359fe3631418b',
		contractABI: ['function mintTo(address recipient) payable returns (uint256)'],
		contractFunction: 'mintTo',
		contractParameters: ['0x44A4b9E2A69d86BA382a511f845CbF2E31286770'],
		txValue: (item.price * 1e18).toString(),
		gasLimit: '8000000'
	};
