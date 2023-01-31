import {NS} from "index"

'use strict'


var maxThreads:number = 1;
export async function main(ns:NS) {
	let serverName:string = <string>ns.args[0];
	if(serverName == undefined) {
		serverName = null;
	}
	if(ns.args[1] != undefined) {
		maxThreads = <number>ns.args[1];
	}

	let maxMoney:number = ns.getServerMaxMoney(serverName);
	let topBoundery:number = maxMoney * 0.90;
	let minimumBoundery:number = maxMoney * 0.60;
	let minSecLevel:number = ns.getServerMinSecurityLevel(serverName);
	let topSecLevel:number = minSecLevel * 2;
	
	while(true) {
		let currentMoney:number = ns.getServerMoneyAvailable(serverName);
		let currentSecLevel:number = ns.getServerSecurityLevel(serverName);
		if(currentSecLevel > topSecLevel) {
			await lowerSecurity(minSecLevel, serverName, ns);
		} else if(currentMoney < minimumBoundery) {
			await growGains(topBoundery, serverName, ns);
		} else {
			await hackServer(serverName, ns);
		}
	}
}


async function lowerSecurity(minLevel:number, serverName:string, ns:NS) {
	//while(ns.getServerSecurityLevel(serverName) > minLevel) {
		let res = await ns.weaken(serverName/*, {threads: maxThreads}*/);
		ns.print(">> lowering security: " + res);
	//}
}

async function growGains(topBoundery:number, serverName:string, ns:NS) {
	//while(ns.getServerMoneyAvailable(serverName) < topBoundery) {
		let res = await ns.grow(serverName/*, , {threads: maxThreads}*/);
		ns.print(">> growing gains: " + res);
	//}
}

async function hackServer(serverName:string, ns:NS) {
	let res = await ns.hack(serverName/*, {threads: maxThreads}*/);
	ns.print(">> hacking: " + res);
}