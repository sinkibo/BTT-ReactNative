
export class Session {
    constructor(private _BTT){}

    establishSession(context?: any, locale?: any, timeZone?: any, input?: any): Promise<{}> {
        return new Promise((resolve, reject) => {   
            this._BTT.establishSession(resolve, reject, context, locale, timeZone, input);
        });
    }

    destroySession(context?: any): Promise<{}> {
        return new Promise((resolve, reject)=>{
            this._BTT.destroySession(resolve, reject, context);
        });
    }
}
