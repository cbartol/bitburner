import {crawlServers, printServers} from "/scripts/crawler.js"

/** @param {NS} ns */
export async function main(ns) {
    let targetName = ns.args[0];
	if(targetName == undefined) {
		ns.tprint("MISSING SERVER ARGUMENT");
        return;
	}
    let allServers = crawlServers(ns);
    //printServers(Array.from(allServers.values()).filter(val => val.isHacked), ns);
    Array.from(allServers.values()).filter(val => val.isHacked).map(srv => srv.serverName).concat(ns.getPurchasedServers()).forEach(serverName => {
        ns.kill("tempScript.js", serverName, targetName);
    });
}