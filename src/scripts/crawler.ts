import {NS} from "../index"
import Server, {getServerMap} from "scripts/server"

'use strict'

export async function main(ns:NS) {
    printServers(nukeMain(ns), ns);
}

export function nukeMain(ns:NS) {
    let allServers:Map<string,Server> = getServerMap(ns);
    //printServers(allServers, ns);
    var toHack:Server[] = Array.from(allServers.values()).filter((val) => !val.isHacked && val.serverName != 'home');
    stealFiles(allServers, ns);
    nukeThemAll(toHack, ns);
    return getServerMap(ns);
}

export function crawlServers(ns:NS):Map<string,Server> {
    return getServerMap(ns);
}

export function printServers(allServers:Map<string,Server>, ns:NS) {
    let result = "";

    const max_col_length =Array.from(allServers.values()).map(el => el.serverName.length).reduce((prev, curr) => (prev>curr)?prev:curr);
    Array.from(allServers.values()).sort((a,b) => a.hackLevel-b.hackLevel).forEach(value => {
        result += `\n${value.serverName.padStart(max_col_length)} | ${value.isHacked.toString().padEnd(5)} | ${value.hackLevel}`;
    });
    ns.tprint(result);
}

function nukeThemAll(toHack:Server[], ns:NS) {
    toHack.forEach(el => {
        if(el.hackLevel <= ns.getHackingLevel() && el.serverName != "home") {
            var availablePorts = 0; 
            if(ns.fileExists('BruteSSH.exe', 'home')){
                ns.brutessh(el.serverName);
                availablePorts++;
            }
            if(ns.fileExists('FTPCrack.exe', 'home')){
                ns.ftpcrack(el.serverName);
                availablePorts++;
            }
            if(ns.fileExists('relaySMTP.exe', 'home')){
                ns.relaysmtp(el.serverName);
                availablePorts++;
            }
            if(ns.fileExists('HTTPWorm.exe', 'home')){
                ns.httpworm(el.serverName);
                availablePorts++;
            }
            if(ns.fileExists('SQLInject.exe', 'home')){
                ns.sqlinject(el.serverName);
                availablePorts++;
            }
            if(el.numPortsRequired <= availablePorts) {
                try {
                    ns.nuke(el.serverName);
                } catch(e) {
                }
            }
        }
    });
}

function stealFiles(allServers:Map<string,Server>, ns:NS) {
    Array.from(allServers.values()).filter(srv => srv.serverName != "home").forEach(srv => {
        let allFiles = ns.ls(srv.serverName).filter(file => file != "tempScript.js" && !file.endsWith(".cct"));
        //let allFiles = ns.ls(srv.serverName).filter(file => file.endsWith(".cct"));
        if(allFiles.length > 0) {
            //ns.tprint(`${srv.serverName} ==> ${allFiles}`);
            ns.scp(allFiles, "home", srv.serverName);
        }
    });
}