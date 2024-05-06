module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensure Vue style names match with "KEBAB_CASE"',
            category: 'Best Practices',
            recommended: true
        },
        schema: [
            {
                type: "object",
                properties: {
                    pattern: {
                        type: "object"
                    }
                },
                additionalProperties: false
            }
        ]
    },
    create(context){
        return {
            Identifier: function(node){
                if(node.parent && node.parent.type === "VariableDeclarator" && node.parent.parent.kind === "const"){
                    let regs = /^[A-Z][A-Z_]*[A-Z]$/;
                    const { pattern } = context.options[0];
                    if(pattern && !pattern.test(node.name)){
                        context.report({
                            node,
                            message: `Vue constants names '${node.name}' does not match patterns.`
                        })
                    }
                }
            }
        }
    }
}