"use strict";

const axios = require('axios').default;
import axiosCookieJarSupport from '../../node_modules/axios-cookiejar-support/lib/index';
const querystring = require('querystring');
import { Buffer } from "buffer";
const tough = require('tough-cookie');
const url = require('url');
axiosCookieJarSupport(axios);
const regions = require("./regions");
const ciphers = [
    'TLS_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_GCM_SHA256',
    'TLS_AES_256_GCM_SHA384',
    'TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256'
];

class API {

    constructor(region = regions.AsiaPacific) {
        this.region = region;
        this.username = null;
        this.user_id = null;
        this.access_token = null;
        this.id_token = null;
        this.entitlements_token = null;
        this.access_token_client = null;
        this.entitlements_token_client = null;
        this.multifactor = false;
        this.cookieJar = null;
        this.client_version = "";
        this.client_build = "";
        this.cookies = null;
        this.user_agent = "RiotClient/58.0.0.4640299.4552318 rso-auth (Windows;10;;Professional, x64)";
        this.ssid = null;
        this.client_platform = {
            "platformType": "PC",
            "platformOS": "Windows",
            "platformOSVersion": "10.0.22000.1.256.64bit",
            "platformChipset": "AMD Ryzen 7 5800X 8-Core Processor"
        };
    }

    getPlayerDataServiceUrl(region) {
        return `https://pd.${region}.a.pvp.net`;
    }

    getPartyServiceUrl(region) {
        return `https://glz-${region}-1.${region}.a.pvp.net`;
    }

    getSharedDataServiceUrl(region) {
        return `https://shared.${region}.a.pvp.net`;
    }

    getPlayerDataPregameURL(region) {
        return `https://glz-${region}-1.${region}.a.pvp.net/pregame`
    }

    getCoreGameDataServiceURL(region) {
        return `https://glz-${region}-1.${region}.a.pvp.net/core-game`
    }

    generateRequestHeaders(extraHeaders = {}) {
        // generate default headers
        const defaultHeaders = {
            'Authorization': `Bearer ${this.access_token}`,
            'X-Riot-Entitlements-JWT': this.entitlements_token,
            'X-Riot-ClientVersion': this.client_version.replace("=shipping", ""),
            'X-Riot-ClientPlatform': Buffer.from(JSON.stringify(this.client_platform)).toString('base64'),
        };

        // merge in extra headers
        return {
            ...defaultHeaders,
            ...extraHeaders,
        }
    }

    reAuthorize(cookie) {
        return axios.post('https://auth.riotgames.com/api/v1/authorization', {
            'client_id': 'play-valorant-web-prod',
            'nonce': '1',
            'redirect_uri': 'https://playvalorant.com/opt_in',
            'response_type': 'token id_token',
            "scope": "account openid"
        }, {
            headers: {
                'Cookie': `${cookie}`,
                'User-Agent': this.user_agent
            },
            jar: this.cookieJar,
            withCredentials: true,
        }).then((response) => {
            if (response.data.errorCode) {
                throw new Error(response.data.errorCode);
            } else if (response.data.error) {
                throw new Error(response.data.error);
            }
            // parse uri
            var parsedUrl = url.parse(response.data.response.parameters.uri);
            // strip # from hash
            var hash = parsedUrl.hash.replace('#', '');
            // parse query string from hash
            var parts = querystring.parse(hash);
            this.id_token = parts.id_token;
            // return access token
            return parts.access_token;
        }).then((access_token) => {
            return axios.post('https://entitlements.auth.riotgames.com/api/token/v1', {}, {
                jar: this.cookieJar,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                },
            }).then((response) => {
                this.access_token = access_token;
                this.entitlements_token = response.data.entitlements_token;
            })
        }).then(() => {
            return axios.post('https://auth.riotgames.com/userinfo', {}, {
                jar: this.cookieJar,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${this.access_token}`,
                },
            }).then((response) => {
                this.user_id = response.data.sub;
                console.log(this.user_id);
            })
        });
    }

    authorize(username, password) {
        this.cookieJar = new tough.CookieJar();
        this.multifactor = false;
        return axios.post('https://auth.riotgames.com/api/v1/authorization', {
            'client_id': 'play-valorant-web-prod',
            'nonce': '1',
            'redirect_uri': 'https://playvalorant.com/opt_in',
            'response_type': 'token id_token',
            "scope": "account openid"
        }, {
            headers: {
                'User-Agent': this.user_agent
            },
            jar: this.cookieJar,
            withCredentials: true,
        }).then((res) => {
            console.log(0)
            return axios.put('https://auth.riotgames.com/api/v1/authorization', {
                'type': 'auth',
                'username': username,
                'password': password,
                "remember": true
            }, {
                headers: {
                    'User-Agent': this.user_agent
                },
                jar: this.cookieJar,
                withCredentials: true,
            }).then((response) => {
                console.log(1)
                console.log(response)
                if (response.data.type === "multifactor") {
                    this.multifactor = true;
                    return;
                }
                // check for error
                if (response.data.errorCode) {
                    throw new Error(response.data.errorCode);
                } else if (response.data.error) {
                    throw new Error(response.data.error);
                }

                // parse uri
                var parsedUrl = url.parse(response.data.response.parameters.uri);
                // strip # from hash
                var hash = parsedUrl.hash.replace('#', '');
                // parse query string from hash
                var parts = querystring.parse(hash);
                this.id_token = parts.id_token;
                // return access token
                return parts.access_token
            });
        }).then((access_token) => {

            // console.log(this.cookies)
            if (this.multifactor === true) return;
            return axios.post('https://entitlements.auth.riotgames.com/api/token/v1', {}, {
                jar: this.cookieJar,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                },

            }).then((response) => {
                this.username = username;
                this.access_token = access_token;
                this.entitlements_token = response.data.entitlements_token;
            });
        }).then(() => {
            if (this.multifactor === true) return;
            return axios.post('https://auth.riotgames.com/userinfo', {}, {
                jar: this.cookieJar,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${this.access_token}`,
                },
            }).then((response) => {
                this.user_id = response.data.sub;
            })
        })
    }

    login(access_token, id_token) {
        return axios.post('https://entitlements.auth.riotgames.com/api/token/v1', {}, {
            jar: this.cookieJar,
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
        }).then((response) => {
            this.id_token = id_token;
            this.access_token = access_token;
            this.entitlements_token = response.data.entitlements_token;
        }).then(() => {
            if (this.multifactor === true) return;
            return axios.post('https://auth.riotgames.com/userinfo', {}, {
                jar: this.cookieJar,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${this.access_token}`,
                },
            }).then((response) => {
                this.user_id = response.data.sub;
            })
        })
    }

    mfa(code) {
        let ms = new Date();
        ms.setDate(ms.getDate() + 30);
        return axios.put('https://auth.riotgames.com/api/v1/authorization', {
            'code': code,
            'rememberDevice': true,
            'type': 'multifactor',
        }, {
            jar: this.cookieJar,
            withCredentials: true,

        }).then((response) => {
            this.cookies = response.headers["set-cookie"]
            let cooked = {};
            this.cookies.forEach((cookie) => {
                let [key, value] = cookie.split("=");
                cooked[key] = value.replace(" Path", "").replace(" Max-Age", "");
                this.cookies = cooked;
            });
            this.ssid = this.cookies.ssid;
            // check for error
            console.log(response.data.errorCode)
            // if (response.data.error) {
            //     throw new Error(response.data.error);
            //     return;
            // }
            if (response.data.errorCode) {
                throw new Error(response.data.errorCode);
                return;
            } else {
                if (response.data.error) {
                    throw new Error(response.data.error);
                    return;
                }
            }

            // parse uri
            var parsedUrl = url.parse(response.data.response.parameters.uri);

            // strip # from hash
            var hash = parsedUrl.hash.replace('#', '');

            // parse query string from hash
            var parts = querystring.parse(hash);

            this.id_token = parts.id_token;

            // return access token
            this.access_token = parts.access_token;
        }).then(() => {
            return axios.post('https://entitlements.auth.riotgames.com/api/token/v1', {}, {
                jar: this.cookieJar,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${this.access_token}`,
                },
            }).then((response) => {
                this.entitlements_token = response.data.entitlements_token;
            });
        }).then(() => {
            return axios.post('https://auth.riotgames.com/userinfo', {}, {
                jar: this.cookieJar,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${this.access_token}`,
                },
            }).then((response) => {
                this.user_id = response.data.sub;
                this.mfa_ms = ms.getTime();
            });
        });
    }

    getConfig(region = this.region) {
        return axios.get(this.getSharedDataServiceUrl(region) + '/v1/config/' + region);
    }

    getRegion() {
        return axios.put('https://riot-geo.pas.si.riotgames.com/pas/v1/product/valorant', JSON.stringify({
            "id_token": this.id_token
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.access_token}`,
            },
            jar: this.cookieJar,
            withCredentials: true,
        }).then((response1) => {
            this.region = response1.data.affinities.live
        })
    }

    getSeasonID() {
        return axios.get("https://valorant-api.com/v1/seasons").then((response) => {
            const now = Date.now();
            const currentSeason = response.data.data.find(season => season.type === "EAresSeasonType::Act" && new Date(season.startTime) < now && new Date(season.endTime) > now);
            return currentSeason.uuid;
        })
    }

    getPlayerSettings() {
        return axios.get(`https://playerpreferences.riotgames.com/playerPref/v3/getPreference/Ares.PlayerSettings`, {
            headers: {
                'Authorization': `Bearer ${process.account.access_token_client}`,
                'X-Riot-Entitlements-JWT': this.entitlements_token,
                'X-Riot-ClientVersion': this.client_version.replace("=shipping", ""),
                'X-Riot-ClientPlatform': Buffer.from(JSON.stringify(this.client_platform)).toString('base64'),
                'User-Agent': this.user_agent,
            },
        });
    }

    async getPurchaseHistory() {
        if (this.ssid == null) {
            return axios.get('https://login.playersupport.riotgames.com/login?brand_id=360004106774&locale_id=1&return_to=https://support-valorant.riotgames.com/hc/en-us/articles/360045132434-Checking-Your-Purchase-History-', {
                jar: this.cookieJar,
                withCredentials: true,
            }).catch(async (response) => {
                return axios.get('https://sspd.playersupport.riotgames.com/valorant_purchase_history', {
                    jar: this.cookieJar,
                    withCredentials: true,
                })
            })
        } else {
            return axios.get('https://login.playersupport.riotgames.com/login?brand_id=360004106774&locale_id=1&return_to=https://support-valorant.riotgames.com/hc/en-us/articles/360045132434-Checking-Your-Purchase-History-', {
                jar: this.cookieJar,
                withCredentials: true,

                headers: {
                    cookie: `ssid=${this.ssid};`
                },
            }).catch(async (response) => {
                return axios.get('https://sspd.playersupport.riotgames.com/valorant_purchase_history', {
                    jar: this.cookieJar,
                    withCredentials: true,

                    headers: {
                        cookie: `ssid=${this.ssid};`
                    },
                })
            })
        }
    }

    getContent() {
        return axios.get(this.getSharedDataServiceUrl(this.region) + '/content-service/v3/content', {
            headers: this.generateRequestHeaders(),
        });
    }

    getEntitlements(playerId) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/store/v1/entitlements/${playerId}`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getMatch(matchId) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/match-details/v1/matches/${matchId}`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getParty(partyId) {
        return axios.get(this.getPartyServiceUrl(this.region) + `/parties/v1/parties/${partyId}`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getClientVersion() {
        return axios.get("https://valorant-api.com/v1/version").then((response) => {
            this.client_version = (response.data.data.riotClientVersion).replace("=shipping", "");
            this.client_build = response.data.data.riotClientBuild;
            this.user_agent = `RiotClient/${response.data.data.riotClientBuild} rso-auth (Windows;10;;Professional, x64)`;
        })
    }

    getPartyByPlayer(playerId) {
        return axios.get(this.getPartyServiceUrl(this.region) + `/parties/v1/players/${playerId}`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getCompetitiveLeaderboard(seasonId, startIndex = 0, size = 510) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/mmr/v1/leaderboards/affinity/${this.region}/queue/competitive/season/${seasonId}?startIndex=${startIndex}&size=${size}`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getPlayerLoadout(playerId) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/personalization/v2/players/${playerId}/playerloadout`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getPlayerMMR(playerId) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/mmr/v1/players/${playerId}`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getPlayerMatchHistory(playerId, startIndex = 0, endIndex = 10) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/match-history/v1/history/${playerId}?startIndex=${startIndex}&endIndex=${endIndex}`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getPlayerCompetitiveHistory(playerId, startIndex = 0, endIndex = 10) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/mmr/v1/players/${playerId}/competitiveupdates?startIndex=${startIndex}&endIndex=${endIndex}`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getPlayerAccountXp(playerId) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/account-xp/v1/players/${playerId}`, {
            headers: this.generateRequestHeaders(),
        });
    }

    getPlayerWallet(playerId) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/store/v1/wallet/${playerId}`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getPlayerStoreFront(playerId) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/store/v2/storefront/${playerId}`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getPlayers(playerIds) {
        return axios.put(this.getPlayerDataServiceUrl(this.region) + '/name-service/v2/players', playerIds, {
            headers: this.generateRequestHeaders(),

        });
    }

    getSession(playerId) {
        return axios.get(this.getPartyServiceUrl(this.region) + `/session/v1/sessions/${playerId}`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getContractDefinitions() {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + '/contract-definitions/v2/definitions', {
            headers: this.generateRequestHeaders(),

        });
    }

    getContracts(playerId) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/contracts/v1/contracts/${playerId}`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getStoryContractDefinitions() {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + '/contract-definitions/v2/definitions/story', {
            headers: this.generateRequestHeaders(),

        });
    }

    getStoreOffers() {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/store/v1/offers`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getContract(playerId) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/contracts/v1/contracts/${playerId}`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getItemUpgradesV2() {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/contract-definitions/v2/item-upgrades`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getItemUpgradesV3() {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/contract-definitions/v3/item-upgrades`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getWeeklies() {
        return axios.get(`https://valorant-api.com/v1/missions?language=zh-TW`, {})
    }

    getBattlepassPurchase(playerId) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/store/v1/entitlements/${playerId}/f85cb6f7-33e5-4dc8-b609-ec7212301948`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getPreplayer(playerId) {
        return axios.get(this.getPlayerDataPregameURL(this.region) + `/v1/players/${playerId}`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getPrematch(matchId) {
        return axios.get(this.getPlayerDataPregameURL(this.region) + `/v1/matches/${matchId}`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getCorePlayer(playerId) {
        return axios.get(this.getCoreGameDataServiceURL(this.region) + `/v1/players/${playerId}`, {
            headers: this.generateRequestHeaders(),

        });
    }

    getCoreMatch(matchId) {
        return axios.get(this.getCoreGameDataServiceURL(this.region) + `/v1/matches/${matchId}`, {
            headers: this.generateRequestHeaders(),

        });
    }
}

module.exports = API;