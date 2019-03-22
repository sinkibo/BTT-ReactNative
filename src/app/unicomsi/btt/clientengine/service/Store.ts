export class Store {
    constructor(private _store: any) {}
    
    update(response: any) {
        return this._store.update(response);
    }
    push(input: any) {
        return this._store.push(input);
    }
    validate(compositeKey_or_input: any, onError: any, value: any) {
        return this._store.validate(compositeKey_or_input, onError, value);
    }
    getErrorFields(compositeKey_or_input: any) {
        return this._store.getErrorFields(compositeKey_or_input);
    }
    extractData() {
        return this._store.extractData();
    }
    extractInputData(input: any) {
        return this._store.extractInputData();
    }
    getValueAt(compositeKey: String) {
        return this._store.getValueAt(compositeKey);
    }
    setValueAt(compositeKey: String, value: any) {
        return this._store.setValueAt(compositeKey);
    }
    find(compositeKey: String) {
        return this._store.find(compositeKey);
    }
}
