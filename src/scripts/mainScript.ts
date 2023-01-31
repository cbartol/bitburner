import {NS} from "../index"

'use strict'

/** @param {NS} ns */
export async function main(ns:NS) {
	let serverName:string = <string>ns.args[0];
	if(serverName == undefined) {
		serverName = null;
	}

	while(true) {
		await ns.sleep(30000);
	}
}