import {crawlServers} from "scripts/crawler.js"
import Server from "scripts/server"
import {NS} from "../index"

'use strict'

function stealFiles(allServers:Map<string,Server>, ns:NS) {
    Array.from(allServers.values()).filter(srv => srv.serverName != "home").forEach(srv => {
        let allFiles = ns.ls(srv.serverName).filter(file => file != "tempScript.js" && !file.endsWith(".cct"));
        if(allFiles.length > 0) {
            ns.scp(allFiles, "home", srv.serverName);
        }
    });
}

function findContracts(allServers:Map<string,Server>, ns:NS) {
    Array.from(allServers.values()).filter(srv => srv.serverName != "home").forEach(srv => {
        let allFiles = ns.ls(srv.serverName).filter(file => file.endsWith(".cct"));
        if(allFiles.length > 0) {
            ns.tprint(`${srv.serverName} ==> ${allFiles}`);
        }
    });
}


/** @param {NS} ns */
export async function main(ns:NS) {
    let allServers = crawlServers(ns);
    
    stealFiles(allServers, ns);
    findContracts(allServers, ns);
}