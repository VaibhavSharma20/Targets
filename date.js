module.exports.getDate=getDate;

function getDate() {
let today = new Date();
let options={
    weekday: "long",
    day:"numeric",
    month: "long"
};

return today.toLocaleDateString("en-US",options);

}
// anonymous function
module.exports.getDay= function() {
    let today = new Date();
    let options={
        weekday: "long"
    };   
    return today.toLocaleDateString("en-US",options);  
}