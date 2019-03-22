
export class UserModel {
  isLoggedIn = false;
  _name = null;
  account_id = "BTT-User-1";
  password = "123456";
  _gender = "M";
  
  constructor() {}

  set gender(g){
    this._gender = g;
  }

  get photo(){
    return this._gender == "M" ? "../../static/images/man.jpg" : "../../static/images/woman.jpg";
  }

  get name(){
    return this._name || this.account_id;
  }

  set name(n){
    this._name = n;
  }

  reset(){
    this.isLoggedIn = false;
    this._name = null;
    this.account_id = "BTT-User-1";
  }
}
