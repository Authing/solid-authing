const Authing = require('authing-js-sdk');
const solid = require('solid-auth-client');
const md5 = require('./md5.js');

const SolidAuthing = function(opts) {

    this.opts = opts;
    this.solid = solid;
    this.authing = null;
    
    this.solid.trackSession(session => {
        if (!session) {
            console.log('The user is not logged in')
        } else {
            console.log(`The user is ${session.webId}`)
        }
    });

}

SolidAuthing.prototype = {
    async getAuthingInsatance() {
        const authingResult = await new Authing({
            clientId: this.opts.clientId,
            secret: this.opts.secret,
        });

        this.authing = authingResult;

        return this;
    },

    check() {
        return this.authing;
    },

    compileStr(code) {
        let c = String.fromCharCode(code.charCodeAt(0) + code.length);
        for(let i = 1; i < code.length; i++) {
            c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
        }
       return md5(escape(c));
    },

    async registerInSolid() {

    },

    async loginInSolid(idp) {
        idp = idp || 'https://solid.authing.cn';
        const session = await this.solid.currentSession();
        if (!session) {
            await this.solid.login(idp);
        }else {
            return session;
        }
    },

    async logoutFromSolid() {
        return this.solid.logout();
    },

    async getSolidCurrentSession() {
        return await this.solid.currentSession();
    },

    async trackSolidSession() {
        return await this.solid.trackSession();
    },

    getSolidUsername(webId) {
        let username = webId;
        if (username.split('.').length !== 1) {
            username = webId.split('.')[0].split('://')[1];
        }
        return username;
    },

    async login() {
        if (!this.check()) {
            throw 'Please use getAuthingInsatance first';
        }

        const solidInfo = await this.loginInSolid();

        let username = this.getSolidUsername(solidInfo.webId);
        const unionid = this.compileStr(username);
        const options = {
            unionid,
        }
        try {
            const userInfo = await this.authing.login(options);
            localStorage.setItem('_authing_userId', userInfo._id);
            return userInfo;    
        }catch(error) {
            if (error.message.code === 2004) {
                const userInfo = {
                    client_id: solidInfo.authorization.client_id,
                    idp: solidInfo.idp,
                    webId: solidInfo.webId,
                }                
                const registerOptions = {
                    unionid,
                    username,
                    oauth: JSON.stringify(userInfo),
                    nickname: username,
                    registerMethod: 'oauth:solid',
                };
                return await this.authing.register(registerOptions);                
            }
        }
    },

    async register() {
        if (!this.check()) {
            throw 'Please use getAuthingInsatance first';
        }

        const solidInfo = await this.loginInSolid();
        const userInfo = {
            client_id: solidInfo.authorization.client_id,
            idp: solidInfo.idp,
            webId: solidInfo.webId,
        }
        let username = this.getSolidUsername(solidInfo.webId);
        const unionid = this.compileStr(username);
        const registerOptions = {
            unionid,
            username,
            oauth: JSON.stringify(userInfo),
            nickname: username,
            registerMethod: 'oauth:solid',
        };
        return await this.authing.register(registerOptions);
    },

    async logout() {
        if (!this.check()) {
            throw 'Please use getAuthingInsatance first';
        }

        try {
            await this.logoutFromSolid();
            if (localStorage.getItem('_authing_token')) {
                const userInfo = await this.authing.logout(localStorage.getItem('_authing_userId'))
                localStorage.removeItem('_authing_userId');
                return userInfo;
            } else {
                return null;
            }
        }catch(error) {
            throw error;
            return null;
        }
    }
};

if(typeof window === 'object') {
	window.SolidAuthing = SolidAuthing;
}

module.exports = SolidAuthing;
