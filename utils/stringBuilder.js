module.exports = {
    fillTemplate: function(templateVars){
        const templateString = '{"message": "${this.content}"}';
        return new Function("return `"+templateString +"`;").call(templateVars);
    }
 }