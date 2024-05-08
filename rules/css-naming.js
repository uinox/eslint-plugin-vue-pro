const casing = require("../utils/casing");
const utils = require("../utils/index");
const allowedCaseOptions = ['camelCase', 'kebab-case', 'snake_case'];
const regs = {
    "camelCase": /^[a-z][a-z0-9]*([A-Z][a-z0-9]*)*$/,
    "kebab-case": /^[a-z][a-z0-9]*(-[a-z0-9]*)*$/
};
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensure template class name matching caseTypes',
            recommended: true
        },
        fixable: 'code',
        schema: [
            {
                type: "object",
                properties: {
                    caseTypes: {
                        type: "array",
                        items: {
                            type: "string",
                            enum: allowedCaseOptions
                        },
                        uniqueItems: true,
                        additionalItems: false
                    },
                    ignores: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        uniqueItems: true,
                        additionalItems: false
                    },
                },
                additionalProperties: false
            }
        ],
        messages: {
            avoidClassName: "Identifier '{{ name }}' is not in ['{{ types }}'] case."
        }
    },
    create(context){
        return utils.defineTemplateBodyVisitor(
            context,
            {
                "VAttribute[directive=true] > VDirectiveKey[name.name='bind'][argument.name='class']"(node){
                    const attributeNode = node.parent;
                    if (!attributeNode.value || !attributeNode.value.expression) {
                        return;
                    }

                    const expressionNode = attributeNode.value.expression;

                    const classList = findStaticClasses(expressionNode);

                    classListCheck(context, classList, node);

                },
                "VAttribute[directive=false][key.name='class']"(node){
                    const value = node.value;
                    if(!value) return;
                    const classList = value.value.split(" ");

                    classListCheck(context, classList, node);

                }
            }    
        )
    }
}
/**
 * @param {context} context
 * @param {classList} classList
 * @param {node} node
 */
function classListCheck(context, classList, node){

    const { caseTypes, ignores } = context.options[0];

    classList.forEach(item=>{

        let isIgnore = false;
        
        if(ignores && ignores.length > 0){
            ignores.forEach(ignore=>{
                if(item.includes(ignore)){
                    isIgnore = true;
                }
            })
        }

        let isCaseChecker = false;
        if(caseTypes && caseTypes.length > 0){
            caseTypes.forEach(caseType => {
                const caseChecker = casing.getChecker(caseType);
                if(caseChecker(item)){
                    isCaseChecker = true;
                }
            })
        }

        if(ignores && !isIgnore && caseTypes && !isCaseChecker){
            context.report({
                node,
                messageId: "avoidClassName",
                data: {
                    name: item,
                    types: caseTypes.join(' , ')
                }
            })
        }
        
    })
}

/**
 * @param {ConditionalExpression} expressionNode
 * @returns {(Literal)[]}
 */
function findStaticClasses(expressionNode) {
    if (isStringLiteral(expressionNode)) {
        return [expressionNode]
    }
    if(expressionNode.type === 'ConditionalExpression'){
        let classList = [];
        for (const key in expressionNode) {
            if (Object.hasOwnProperty.call(expressionNode, key)) {
                const element = expressionNode[key];
                if(element.type === 'Literal'){
                    classList.push(element.value);
                }
            }
        }
        return classList;
    }
    return [];
}

/**
 * @param {ASTNode} node
 * @returns {node is Literal | TemplateLiteral}
 */
function isStringLiteral(node) {
    return (
        (node.type === 'Literal' && typeof node.value === 'string') ||
        (node.type === 'TemplateLiteral' && node.expressions.length === 0)
    )
}