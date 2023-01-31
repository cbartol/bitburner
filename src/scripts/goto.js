import {crawlServers} from "/scripts/crawler.js"

class NodeCost {
    previousNode; //NodeCost
    node; //Server
    cost; //number
    distance; //number
    visitedNodes = new Set(); //Set<string>

    constructor(n, d, c, v, p) { //n:Node, d:number, c:number, v:Set<string>, p:NodeCost
        this.node = n;
        this.distance = d;
        this.cost = c;
        this.visitedNodes = new Set(v);
        this.visitedNodes.add(n.serverName);
        this.previousNode = p;
    }

    printPath() {//return :string
        return (this.previousNode)?this.previousNode.printPath() + ' -> ' + this.node.serverName:this.node.serverName;
    }

    printCommand() {//return :string
        return (this.previousNode)?this.previousNode.printCommand() + `connect ${this.node.serverName};`:`connect ${this.node.serverName};`;
    }
}




/** @param {NS} ns */
export async function main(ns) {
    let targetName = ns.args[0];
	if(targetName == undefined) {
		ns.tprint("MISSING SERVER ARGUMENT");
        return;
	}

    let allServers = crawlServers(ns);
    //Array.from(allServers.values()).forEach(srv => {
    //    ns.scp("/scripts/findPath.js", srv.serverName, 'home');
    //});
    let startNode = allServers.get(ns.getHostname());
    let endNode = allServers.get(targetName);

    let processingNodes = [new NodeCost(startNode, 0, 0, new Set(), null)]; //NodeCost[]

    let processingNode = processingNodes.shift(); //NodeCost
    while(processingNode.node != endNode){
        processingNode.node.neighbours.forEach(node => {
            if(!processingNode.visitedNodes.has(node.serverName)) {
                processingNodes.push(new NodeCost(node, processingNode.distance+1, processingNode.distance+1, processingNode.visitedNodes, processingNode));
            }
        });

        processingNodes.sort((a,b)=> a.cost - b.cost);
        if(processingNodes.length == 0) {
            break;
        }
        processingNode = processingNodes.shift();
    }
    //ns.tprint(processingNode.printCommand());
    const terminalInput = document.getElementById("terminal-input");

    // Set the value to the command you want to run.
    terminalInput.value=processingNode.printCommand();

    // Get a reference to the React event handler.
    const handler = Object.keys(terminalInput)[1];

    // Perform an onChange event to set some internal values.
    terminalInput[handler].onChange({target:terminalInput});

    // Simulate an enter press
    terminalInput[handler].onKeyDown({key:'Enter',preventDefault:()=>null});
}