const SolidAuthing = require('../src/index.js');

const main = async () => {
    const solidAuthing = new SolidAuthing({
        clientId: '5c023e9540bf870001aad12d',
        secret: 'f37b3e9c458a17afc3e7f08edaa8f225',
    });

    const sa = await solidAuthing.getAuthingInsatance();
    
    console.log(sa);    
}

main();