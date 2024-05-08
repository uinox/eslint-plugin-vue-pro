module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensure constant names match with patterns',
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
        ],
        messages: {
            avoidConstant: "Identifier '{{ name }}' is not match patterns."
        }
    },
    create(context){
        return {
            Identifier: function(node){
                if(node.parent && node.parent.type === "VariableDeclarator" && node.parent.parent.kind === "const"){
                    const { pattern } = context.options[0];
                    if(pattern && !pattern.test(node.name)){
                        context.report({
                            node,
                            messageId: "avoidConstant",
                            data: {
                                name: node.name
                            }
                        })
                    }
                }
            }
        }
    }
}