import { state } from "../model";

class SearchView {
_parentEl = document.querySelector('.search');

getQuery() {
   
    const query =  this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
    
};

_clearInput() {
    this._parentEl.querySelector('.search__field').value= '';
};

addHandlerSearch(handler) {
this._parentEl.addEventListener('submit', function(ev){
    ev.preventDefault();
    handler();
})
}
}

export default new SearchView();