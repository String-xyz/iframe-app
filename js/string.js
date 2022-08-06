const CHANNEL = 'STRING_PAY';
const INTERNAL_URL = "http://localhost:8080/";
window.StringFrame = StringFrame;

const Events = { 
    onCardSubmitted: event => {},
    onCardFailed: event => {},
    onCardTokenized: event => {},
    onTransactFailed: error => {},
    onTransact: event =>  {},
}

const StringFrame = { 
    apiKey: "",
    enabled: false,
    events: Events,
    init: apiKey => { 
        this.apiKey = apiKey
        this.loadiFrame();
    },

    loadiFrame: () => { 
        const container = document.querySelector(".string-pay");
        if (container === undefined) { 
            console.error("Unable to load iFrame");
            return
        }
        const iframe = document.createElement('iframe');
        iframe.src = INTERNAL_URL;
        container.appendChild(iframe);

        window.addEventListener('message', function (e) {
            const data = JSON.parse(e.data);
            const channel = data.channel;
            if (channel ==CHANNEL) { 
                handleEvent(data)
            }
        });  
    },
    
    handleEvent: event => { 
    
    },
    
    raiseError: message => { 
        console.error(message)
    },

    transact: (payload) => {

    },
    
}
