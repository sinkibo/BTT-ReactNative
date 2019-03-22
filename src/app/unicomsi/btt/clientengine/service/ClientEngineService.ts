import { Store } from './Store';
import { Session } from './Session';
import { Flow } from './Flow';

export { Store, Flow, Session };

export class ClientEngineService {

    private _session: Session;
    private _flow: Flow;
    private _flows: Map<string, Flow> = new Map<string, Flow>();
    private _store: Store;
    
    constructor(private _BTT) {
        if (!_BTT)
        {
            this._BTT = window["BTT"];
        }
        this._session = new Session(this._BTT);
    }

    loadBTT(basePath: string, sourceName?: string) {
        this._BTT.loadBTT(basePath, sourceName);
    }

    establishSession(context?: any, locale?: any, timeZone?: any, input?: any): Promise<any> {
        return this._session.establishSession(context, locale, timeZone, input);
    }

    destroySession(context?: any): Promise<{}> {
        return this._session.destroySession(context);
    }

    launchFlow(flowName: String, input?: any, context?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._flow = new Flow(this._BTT.launchFlow(flowName, input, resolve, function(tresp, tflow, tef){
                reject({
                    "response" : tresp,
                    "flow" : tflow,
                    "errorFields": tef
                });
            }, context));
        });
    }

    execOperation(operationName: String, input?: any, context?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._BTT.execOperation(operationName, input, resolve, reject, context);
        });
    }

    getSession(): Session {
        return this._session;
    }
    getFlow(name?:string): Flow {
        return (name ? this._flows[name] : this._flow ) || this._flow;
    }
    setFlow(flow: Flow, name?: string){
        this._flow[name || flow.getName()] = flow;
    }

    getStore(): Store {
        return this._store;
    }

    setStore(store: any) {
        this._store = new Store(store);
    }

    async launchFlow_ES6(flowName, input, context){
        var _this = this;
        return await new Promise((resolve, reject) => {
            this._flow = new Flow(_this._BTT.launchFlow(flowName, input, resolve, function(tresp, tflow, tef){
                reject({
                    "response" : tresp,
                    "flow" : tflow,
                    "errorFields": tef
                });
            }, context));
            
        });
    }

    async execOperation_ES6(operationName, input, context){
        return await new Promise((resolve, reject) => {
            this._BTT.execOperation(operationName, input, resolve, reject, context);
        });
    }
}
