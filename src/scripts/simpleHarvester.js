import {nukeMain} from "/scripts/crawler.js"

async function spawnHarvester(scriptFile, targetName, srv, ns) {
    await ns.scp(scriptFile, srv.serverName);
    let requiredRAM = ns.getScriptRam(scriptFile, srv.serverName);
    let freeRAM = srv.maxRAM - srv.usedRam;
    let numOfThreads = Math.floor(freeRAM / requiredRAM);
    if(!ns.scriptRunning(scriptFile, srv.serverName) && numOfThreads > 0) {
        ns.exec(scriptFile, srv.serverName, numOfThreads, targetName);
    }
}


/** @param {NS} ns */
export async function main(ns) {
    let targetName = ns.args[0];
	if(targetName == undefined) {
		ns.tprint("MISSING SERVER ARGUMENT");
        return;
	}
    
    let allServers = nukeMain(ns);
    //printServers(Array.from(allServers.values()).filter(val => val.isHacked), ns);
    Array.from(allServers.values()).filter(val => val.isHacked).forEach(srv => {
        spawnHarvester("tempScript.js", targetName, srv, ns);
    });
}