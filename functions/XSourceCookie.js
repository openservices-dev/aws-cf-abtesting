'use strict';

const cookieName = 'X-Source'.toLowerCase();
const sourceMain = 'main';
const sourceExperiment = 'experiment';
const experimentTraffic = 0.5;

function handler (event) {
    const request = event.request;
    const cookies = request.cookies;
    
    if (!request.uri.endsWith('/')) {
        return request;
    }
    
    if (cookieName in cookies && cookies[cookieName].value === sourceMain) {
        request.querystring['version'] = { value: 'a' };
    }
    
    if (cookieName in cookies && cookies[cookieName].value === sourceExperiment) {
        request.querystring['version'] = { value: 'b' };
    }
    
    if (cookieName in cookies === false) {
        const r = Math.random();
        
        if (r < experimentTraffic) {
            request.querystring['version'] = { value: 'a' };
            request.cookies = {
                [cookieName]: {
                    value: 'main'
                }
            };
        } else {
            request.querystring['version'] = { value: 'b' };
            request.cookies = {
                [cookieName]: {
                    value: 'experiment'
                }
            };
        }
    }
    
    return request;
}
