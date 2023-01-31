import {NS} from "../../index"

'use strict'

/** @param {NS} ns */
export async function main(ns:NS) {
	var maxThreads:number = 1;
	let serverName:string = <string>ns.args[0];
	if(serverName == undefined) {
		ns.print(">> missing serverName argument");
		return;
	}
	if(ns.args[1] != undefined) {
		maxThreads = <number>ns.args[1];
	}
	await ns.weaken(serverName, {threads: maxThreads});
}