import {nukeMain, Server} from "scripts/crawler.js"
import {NS} from "../index"

'use strict'

async function spawnHarvester(scriptFile:string, targetName:string, srv:Server, ns:NS) {
    await ns.scp(scriptFile, srv.serverName);
    let requiredRAM:number = ns.getScriptRam(scriptFile, srv.serverName);
    let freeRAM:number = srv.maxRAM - srv.usedRam;
    let numOfThreads:number = Math.floor(freeRAM / requiredRAM);
    if(!ns.scriptRunning(scriptFile, srv.serverName) && numOfThreads > 0) {
        ns.exec(scriptFile, srv.serverName, numOfThreads, targetName);
    }
}


/** @param {NS} ns */
export async function main(ns:NS) {
    let targetName:string = <string>ns.args[0];
	if(targetName == undefined) {
		ns.tprint("MISSING SERVER ARGUMENT");
        return;
	}
    
    let allServers:Map<string,Server> = nukeMain(ns);
    //printServers(Array.from(allServers.values()).filter(val => val.isHacked), ns);
    Array.from(allServers.values()).filter(val => val.isHacked).forEach(srv => {
        spawnHarvester("tempScript.js", targetName, srv, ns);
    });
}