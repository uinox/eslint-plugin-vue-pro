const casing = require("../utils/casing");
const utils = require("../utils/index");
const allowedCaseOptions = ['camelCase', 'kebab-case'];
const regs = {
    "camelCase": /^[a-z][a-z0-9]*([A-Z][a-z0-9]*)*$/,
    "kebab-case": /^[a-z][a-z0-9]*(-[a-z0-9]*)*$/
};
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensure Vue style names match with "KEBAB_CASE"',
            category: 'Best Practices',
            recommended: true
        },
        fixable: 'code',
        schema: [
            {
                type: "object",
                properties: {
                    caseType: {
                        type: "string",
                        enum: allowedCaseOptions
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
        ]
    },
    create(context){
        return utils.defineTemplateBodyVisitor(
            context,
            {
                "VAttribute[directive=false][key.name='class']"(node){
                    const value = node.value;
                    if(!value) return;
                    const { caseType, ignores } = context.options[0];
                    const classList = value.value.split(" ");
                    classList.forEach(item=>{

                        let isIgnore = false;
                        
                        if(ignores && ignores.length > 0){
                            ignores.forEach(ignore=>{
                                if(item.includes(ignore)){
                                    isIgnore = true;
                                }
                            })
                        }

                        const caseChecker = casing.getChecker(caseType || 'camelCase');
                        if(!isIgnore && caseType && !caseChecker(item)){
                            context.report({
                                node,
                                message: `Vue css class names '${item}' does not match patterns, you should name them such as ${caseType === 'kebab-case' ? 'box-header' : 'boxHeader'}.`
                            })
                        }
                        
                    })
                }
            }    
        )
    }
}