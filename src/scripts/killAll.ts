import {crawlServers} from "scripts/crawler.js"
import Server from "scripts/server"
import {NS} from "../index"

'use strict'


/** @param {NS} ns */
export async function main(ns:NS) {
    let targetName:string = <string>ns.args[0];
	if(targetName == undefined) {
		ns.tprint("MISSING SERVER ARGUMENT");
        return;
	}
    let allServers:Map<string, Server> = crawlServers(ns);
    //printServers(Array.from(allServers.values()).filter(val => val.isHacked), ns);
    Array.from(allServers.values()).filter(val => val.isHacked).map(srv => srv.serverName).concat(ns.getPurchasedServers()).forEach(serverName => {
        ns.kill("tempScript.js", serverName, targetName);
    });
}