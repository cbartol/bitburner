import {crawlServers} from "/scripts/crawler.js"


function stealFiles(allServers, ns) {
    Array.from(allServers.values()).filter(srv => srv.serverName != "home").forEach(srv => {
        let allFiles = ns.ls(srv.serverName).filter(file => file != "tempScript.js" && !file.endsWith(".cct"));
        if(allFiles.length > 0) {
            ns.scp(allFiles, "home", srv.serverName);
        }
    });
}

function findContracts(allServers, ns) {
    Array.from(allServers.values()).filter(srv => srv.serverName != "home").forEach(srv => {
        let allFiles = ns.ls(srv.serverName).filter(file => file.endsWith(".cct"));
        if(allFiles.length > 0) {
            ns.tprint(`${srv.serverName} ==> ${allFiles}`);
        }
    });
}


/** @param {NS} ns */
export async function main(ns) {
    let allServers = crawlServers(ns);
    
    stealFiles(allServers, ns);
    findContracts(allServers, ns);
}