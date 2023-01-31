/** @param {NS} ns */
export async function main(ns) {
	var maxThreads = 1;
	let serverName = ns.args[0];
	if(serverName == undefined) {
		ns.print(">> missing serverName argument");
		return;
	}
	if(ns.args[1] != undefined) {
		maxThreads = ns.args[1];
	}
	await ns.weaken(serverName, {threads: maxThreads});
}