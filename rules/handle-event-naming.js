const casing = require("../utils/casing");
const utils = require("../utils/index");

const ALLOWED_CASE_OPTIONS = ["kebab-case", "camelCase"];
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensure handle event method names matche rules',
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
        ],
        messages: {
            avoidPrefixes: "Identifier '{{ name }}' should start with ['{{ prefixes }}'].",
            avoidSuffixes: "Identifier '{{ name }}' should end with ['{{ suffixes }}'].",
            avoidCaseType: "Identifier '{{ name }}' is not in '{{ caseType }}' case.",
            avoidMaxLen: "Identifier '{{ name }}' length exceeds the maxLen '{{ maxLen }}'."
        }
    },
    create(context){

        return utils.defineTemplateBodyVisitor(
            context,
            {
                VElement(node) {
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
                                            messageId: "avoidPrefixes",
                                            data: {
                                                name: item.value.expression.name,
                                                prefixes
                                            }
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
                                            messageId: "avoidSuffixes",
                                            data: {
                                                name: item.value.expression.name,
                                                suffixes
                                            }
                                        })
                                    }

                                    const caseChecker = casing.getChecker(caseType || 'camelCase');
                                    if(caseType && !caseChecker(item.value.expression.name)){
                                        context.report({
                                            node,
                                            messageId: "avoidCaseType",
                                            data: {
                                                name: item.value.expression.name,
                                                caseType
                                            }
                                        })
                                    }
                                    if(maxLen && item.value.expression.name.length > maxLen){
                                        context.report({
                                            node,
                                            messageId: "avoidMaxLen",
                                            data: {
                                                name: item.value.expression.name,
                                                maxLen
                                            }
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
            "ObjectExpression > Property[key.name='methods'] > ObjectExpression > Property[key.name][value.type='FunctionExpression']"(node){
                const methodName = node.key.name;
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