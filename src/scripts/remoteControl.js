remoteEvent = async (event) => {
    return new Promise(async (resolve) => {
        if (!event || !event.detail) {
            resolve();
            return;
        }

        if (!document.getElementById('slider')) {
            resolve();
            return;
        }

        const type = event.detail.type;

        if (type === 'next_slide') {
            await document.getElementById('slider').slideNext();
        } else if (type === 'prev_slide') {
            await document.getElementById('slider').slidePrev();
        }

        resolve();
    });
};

reconnectRemoteControl = () => {
    return new Promise(async (resolve) => {
        const deckgoRemoteElement = document.querySelector("deckgo-remote");

        if (!deckgoRemoteElement) {
            resolve();
            return;
        }

        await deckgoRemoteElement.connect();
    });
};

initRemote = async () => {
    return new Promise(async (resolve) => {
        const deckgoRemoteElement = document.querySelector("deckgo-remote");

        if (!deckgoRemoteElement || !window) {
            resolve();
            return;
        }

        deckgoRemoteElement.addEventListener('event', async event => {
            await remoteEvent(event)
        });

        window.addEventListener('resize', async () => {
            await remoteSize();
        });

        await remoteSize();

        await initDeckMove();

        resolve();
    });
};

function initDeckMove() {
    return new Promise(async (resolve) => {
        const deck = document.getElementById('slider');

        if (!deck) {
            resolve();
            return;
        }

        deck.addEventListener('slideNextStart', async () => {
            await slidePrevNext(true)
        });

        deck.addEventListener('slidePrevStart', async () => {
            await slidePrevNext(false)
        });

        deck.addEventListener('slideWillChange', async (event) => {
            await moveRemote(event)
        });

        deck.addEventListener('slideDrag', async (event) => {
            await scrollRemote(event)
        });

        resolve();
    });
}

function remoteSize() {
    return new Promise(async (resolve) => {
        const deckgoRemoteElement = document.querySelector("deckgo-remote");

        if (!deckgoRemoteElement) {
            resolve();
            return;
        }

        deckgoRemoteElement.width = window.innerWidth;
        deckgoRemoteElement.height = window.innerHeight;

        deckgoRemoteElement.server = SIGNALING_SERVER;

        const deck = document.getElementById('slider');

        if (!deckgoRemoteElement || !deck) {
            resolve();
            return;
        }

        deckgoRemoteElement.slides = deck.childElementCount;

        resolve();
    });
}

function slidePrevNext(next) {
    return new Promise(async (resolve) => {
        const deckgoRemoteElement = document.querySelector("deckgo-remote");

        if (!deckgoRemoteElement) {
            resolve();
            return;
        }

        if (next) {
            await deckgoRemoteElement.nextSlide();
        } else {
            await deckgoRemoteElement.prevSlide();
        }

        resolve();
    });
}

function moveRemote(event) {
    return new Promise(async (resolve) => {
        const deckgoRemoteElement = document.querySelector("deckgo-remote");

        if (!deckgoRemoteElement) {
            resolve();
            return;
        }

        await deckgoRemoteElement.moveDraw(event.detail, '300ms');

        resolve();
    });
}

function scrollRemote(event) {
    return new Promise(async (resolve) => {
        const deckgoRemoteElement = document.querySelector("deckgo-remote");

        if (!deckgoRemoteElement) {
            resolve();
            return;
        }

        await deckgoRemoteElement.moveDraw(event.detail, '0ms');

        resolve();
    });
}
