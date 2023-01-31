

/** @param {NS} ns */
export async function main(ns) {
	let serverName = ns.args[0];
	if(serverName == undefined) {
		serverName = null;
	}

	while(true) {
		await ns.sleep(30000);
	}
}