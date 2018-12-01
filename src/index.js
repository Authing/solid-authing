const Authing = require('authing-js-sdk');
const solid = require('solid-auth-client');

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

    async registerInSolid() {

    },

    async loginInSolid(idp) {
        const session = await this.solid.auth.currentSession();
        if (!session) {
            await this.solid.auth.login(idp);
        }else {
            return session;
        }
    },

    async logoutFromSolid() {
        return this.solid.auth.logout();
    },

    async getSolidCurrentSession() {
        return await this.solid.auth.currentSession();
    },

    async trackSolidSession() {
        return await this.solid.auth.trackSession();
    },

    async login(options) {
        if (this.check()) {
            throw 'Please use getAuthingInsatance first';
        }

        const userInfo = await this.authing.login(options);
        const solidInfo = await this.loginInSolid('https://solid.authing.cn');
    },

    async register() {
        const userInfo = await this.authing.login(options);
        const solidInfo = await this.loginInSolid();
    },

    async logout() {
        const userInfo = await this.authing.logout('_id');
        const solidInfo = await this.logoutFromSolid();
    }
};

if(typeof window === 'object') {
	window.SolidAuthing = SolidAuthing;
}

module.exports = SolidAuthing;
