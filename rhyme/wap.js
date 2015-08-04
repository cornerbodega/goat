var array = [];
var links = document.getElementsByTagName("a");
//console.log(document.getElementsByName("1.2.4"));
function ShowResults(value, index, ar) {
        alert(index);
}
//var input = document.getElementsByTagName("input");
var inputList = Array.prototype.slice.call(links);
console.log(inputList.length);
inputList.forEach(ShowResults);
