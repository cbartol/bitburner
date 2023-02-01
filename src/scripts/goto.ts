import {crawlServers} from "scripts/crawler.js"
import Server from "scripts/server"
import {NS} from "../index"

'use strict'

class NodeCost {
    previousNode:NodeCost; //NodeCost
    node:Server; //Server
    cost:number; //number
    visitedNodes:Set<string> = new Set<string>(); //Set<string>

    constructor(n:Server, c:number, v:Set<string>, p:NodeCost) { //n:Node, c:number, v:Set<string>, p:NodeCost
        this.node = n;
        this.cost = c;
        this.visitedNodes = new Set(v);
        this.visitedNodes.add(n.serverName);
        this.previousNode = p;
    }

    printPath():string {//return :string
        return (this.previousNode)?this.previousNode.printPath() + ' -> ' + this.node.serverName:this.node.serverName;
    }

    printCommand():string {//return :string
        return (this.previousNode)?this.previousNode.printCommand() + `connect ${this.node.serverName};`:`connect ${this.node.serverName};`;
    }
}




/** @param {NS} ns */
export async function main(ns:NS) {
    let targetName:string = <string>ns.args[0];
	if(targetName == undefined) {
		ns.tprint("MISSING SERVER ARGUMENT");
        return;
	}

    let allServers:Map<string,Server> = crawlServers(ns);
    //Array.from(allServers.values()).forEach(srv => {
    //    ns.scp("/scripts/findPath.js", srv.serverName, 'home');
    //});
    let startNode:Server = allServers.get(ns.getHostname())!;
    let endNode:Server = allServers.get(targetName)!;
    if(endNode == undefined) {
        ns.tprint("UNKNOWN SERVER: " + targetName);
        return;
    }

    let processingNodes:NodeCost[] = [new NodeCost(startNode, 0, new Set(), null)]; //NodeCost[]

    let processingNode:NodeCost = processingNodes.shift(); //NodeCost
    while(processingNode.node != endNode){
        processingNode.node.neighbours.forEach(node => {
            if(!processingNode.visitedNodes.has(node.serverName)) {
                processingNodes.push(new NodeCost(node, processingNode.cost+1, processingNode.visitedNodes, processingNode));
            }
        });

        processingNodes.sort((a,b)=> a.cost - b.cost);
        if(processingNodes.length == 0) {
            break;
        }
        processingNode = processingNodes.shift();
    }
    //ns.tprint(processingNode.printCommand());
    const terminalInput:any = document.getElementById("terminal-input");

    // Set the value to the command you want to run.
    terminalInput.value=processingNode.printCommand();

    // Get a reference to the React event handler.
    const handler = Object.keys(terminalInput)[1];

    // Perform an onChange event to set some internal values.
    terminalInput[handler].onChange({target:terminalInput});

    // Simulate an enter press
    terminalInput[handler].onKeyDown({key:'Enter',preventDefault:()=>null});
}