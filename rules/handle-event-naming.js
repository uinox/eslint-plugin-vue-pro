const casing = require("../utils/casing");
const utils = require("../utils/index");

const ALLOWED_CASE_OPTIONS = ["kebab-case", "camelCase"];
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensure Vue event handle method names start with "handle"',
            category: 'Best Practices',
            recommended: true
        },
        schema: [
            {
                type: "object",
                properties: {
                    prefixes: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        uniqueItems: true,
                        additionalItems: false
                    },
                    suffixes: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        uniqueItems: true,
                        additionalItems: false
                    },
                    caseType: {
                        type: "string",
                        enum: ALLOWED_CASE_OPTIONS
                    },
                    maxLen: {
                        type: "number"
                    }
                },
                additionalProperties: false
            }
        ]
    },
    create(context){
        // console.log("----resourceCode", context.sourceCode);
        return utils.defineTemplateBodyVisitor(
            context,
            // Event handlers for <template>.
            {
                VElement(node) {
                    //...
                    if(node.startTag.attributes.length>0){
                        node.startTag.attributes.forEach(item=>{
                            if(item.key.name.rawName == "on" || item.key.name.rawName == "@"){
                                if(item.value && item.value.expression && item.value.expression.name){
                                    const { prefixes, suffixes, caseType, maxLen } = context.options[0];
                                    let prefixesCheck = false;
                                    if(prefixes && prefixes.length > 0){
                                        prefixes.forEach(prefix=>{
                                            if(item.value.expression.name.startsWith(prefix)){
                                                prefixesCheck = true;
                                            }
                                        })
                                    }
                                    if(prefixes && !prefixesCheck){
                                        context.report({
                                            node,
                                            message: `Vue event handle method '${item.value.expression.name}' should start with [${prefixes}].`
                                        });
                                    }
                                    let suffixesCheck = false;
                                    if(suffixes && suffixes.length > 0){
                                        suffixes.forEach(suffix=>{
                                            if(item.value.expression.name.endsWith(suffix)){
                                                suffixesCheck = true;
                                            }
                                        })
                                    }
                                    if(suffixes && !suffixesCheck){
                                        context.report({
                                            node,
                                            message: `Vue event handle method '${item.value.expression.name}' should end with [${suffixes}].`
                                        })
                                    }

                                    const caseChecker = casing.getChecker(caseType || 'camelCase');
                                    if(caseType && !caseChecker(item.value.expression.name)){
                                        context.report({
                                            node,
                                            message: `Vue event handle method '${item.value.expression.name}' does not match the '${caseType}' pattern`
                                        })
                                    }
                                    if(maxLen && item.value.expression.name.length > maxLen){
                                        context.report({
                                            node,
                                            message: `Vue event handle method '${item.value.expression.name}' length exceeds the maxLen ${maxLen}`
                                        })
                                    }
                                }
                            }
                        })
                    }
                }
            }
        )
    
        /* return {
            // "ObjectExpression > Property[key.name='methods'] > ObjectExpression > Property[key.name=/^on.+/][value.type='FunctionExpression']"(node){
            "ObjectExpression > Property[key.name='methods'] > ObjectExpression > Property[key.name][value.type='FunctionExpression']"(node){
                console.log("---node",node.key.name);
                const methodName = node.key.name;
                console.log("--methodName--",methodName);
                if(!methodName.startsWith('handle')){
                    context.report({
                        node,
                        message: `Vue event handle method '${methodName}' should start with 'handle'.`
                    });
                }
            },
        }; */
    }
};