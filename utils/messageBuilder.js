module.exports = {
    error: function(messageStr){
        const template = function(templateVars){
            const templateString = '{"message": "${this.content}"}';
            return new Function("return `"+templateString +"`;").call(templateVars);
        }
        return JSON.parse(template({ content: messageStr}));
    }
 }