/** @param {NS} ns */

var maxThreads = 1;
export async function main(ns) {
	let serverName = ns.args[0];
	if(serverName == undefined) {
		serverName = null;
	}
	if(ns.args[1] != undefined) {
		maxThreads = ns.args[1];
	}

	let maxMoney = ns.getServerMaxMoney(serverName);
	let topBoundery = maxMoney * 0.90;
	let minimumBoundery = maxMoney * 0.60;
	let minSecLevel = ns.getServerMinSecurityLevel(serverName);
	let topSecLevel = minSecLevel * 2;
	
	while(true) {
		let currentMoney = ns.getServerMoneyAvailable(serverName);
		let currentSecLevel = ns.getServerSecurityLevel(serverName);
		if(currentSecLevel > topSecLevel) {
			await lowerSecurity(minSecLevel, serverName, ns);
		} else if(currentMoney < minimumBoundery) {
			await growGains(topBoundery, serverName, ns);
		} else {
			await hackServer(serverName, ns);
		}
	}
}


async function lowerSecurity(minLevel, serverName, ns) {
	//while(ns.getServerSecurityLevel(serverName) > minLevel) {
		let res = await ns.weaken(serverName/*, {threads: maxThreads}*/);
		ns.print(">> lowering security: " + res);
	//}
}

async function growGains(topBoundery, serverName, ns) {
	//while(ns.getServerMoneyAvailable(serverName) < topBoundery) {
		let res = await ns.grow(serverName/*, , {threads: maxThreads}*/);
		ns.print(">> growing gains: " + res);
	//}
}

async function hackServer(serverName, ns) {
	let res = await ns.hack(serverName/*, {threads: maxThreads}*/);
	ns.print(">> hacking: " + res);
}