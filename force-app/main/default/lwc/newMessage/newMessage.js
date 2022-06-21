import { LightningElement } from 'lwc';

export default class NewMessage extends LightningElement {

    handleError() {
        // this.fields.STARTTIME_FIELD = Date.now();
        // this.fields.ENDTIME_FIELD = Date.now();
        // console.log("handleError method");
        // console.log(typeof this.fields.STARTTIME_FIELD);
        this.dispatchEvent(new CustomEvent('closemodal'));
    }
}