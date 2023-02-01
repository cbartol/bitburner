import {NS} from "../index"
"use strict";

const HOME_RESERVED_MEMORY:number = 50;

export default class Server {
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

function getServerMaxRam(serverName:string, ns:NS) {
    return ns.getServerMaxRam(serverName) - ((serverName != "home")?0:HOME_RESERVED_MEMORY);
}

export function getServerMap(ns:NS):Map<string,Server> {
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