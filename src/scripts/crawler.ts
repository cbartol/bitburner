import {NS} from "../index"

'use strict'

export async function main(ns:NS) {
    printServers(nukeMain(ns), ns);
}

const HOME_RESERVED_MEMORY:number = 50;

export function nukeMain(ns:NS) {
    let allServers:Map<string,Server> = crawlServers(ns);
    //printServers(allServers, ns);
    var toHack:Server[] = Array.from(allServers.values()).filter((val) => !val.isHacked && val.serverName != 'home');
    stealFiles(allServers, ns);
    nukeThemAll(toHack, ns);
    return crawlServers(ns);
}

export class Server {
    serverName:string;
    isHacked:boolean = true;
    linked:string[] = []; //string
    neighbours:Server[] = []; //Server
    hackLevel:number = 1;
    numPortsRequired:number = 0;
    maxRAM:number = 0;
    usedRam:number = 0;

    constructor(name:string, ns:NS) {
        this.serverName = name;
        this.isHacked = ns.hasRootAccess(name);
        this.linked = ns.scan(name);
        this.hackLevel = ns.getServerRequiredHackingLevel(name);
        this.numPortsRequired = ns.getServerNumPortsRequired(name);
        this.maxRAM = getServerMaxRam(name, ns);
        this.usedRam = ns.getServerUsedRam(name);
    }
}

export function crawlServers(ns:NS):Map<string,Server> {
    let s:Server = new Server('home', ns);
    s.isHacked = true;
    let allServers:Map<string,Server> = new Map<string,Server>();
    allServers.set('home', s);
    
    let toVisit:string[] = [s.serverName];
    let visited:Set<string> = new Set<string>();
    
    
    while(toVisit.length > 0) {
        let currentServer:string = toVisit.shift()!;
        //ns.tprint('scanning: ' + currentServer);
        let scannedServers:string[] = ns.scan(currentServer);
        visited.add(currentServer);
        scannedServers.forEach(el => {
            let serv:Server;
            if(visited.has(el)) {
                serv = allServers.get(el)!;
            } else {
                toVisit.push(el);
                serv = new Server(el, ns);
            }
            allServers.set(el, serv);
        });
    }
    Array.from(allServers.values()).forEach(srv => {
        srv.linked.forEach(s => {
            srv.neighbours.push(allServers.get(s)!);
        });
    });
    return allServers;
}

function getServerMaxRam(serverName:string, ns:NS) {
    return ns.getServerMaxRam(serverName) - ((serverName != "home")?0:HOME_RESERVED_MEMORY);
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