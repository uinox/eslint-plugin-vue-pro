const casing = require("../utils/casing");
const allowedCaseOptions = ['camelCase', 'snake_case', 'PASCAL_CASE'];

module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensure file name matching caseTypes',
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
                    fileTypes: {
                        type: "array",
                        items: {
                            type: "string"
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
            avoidFileName: "File '{{ name }}' is not in ['{{ types }}'] case."
        }
    },
    create(context){
        return {
            Program(node){
                const { caseTypes, fileTypes, ignores } = context.options[0];
                const fileName = context.getFilename().match(/\w+.\w+$/)[0];
                const componentName = fileName.match(/\w+/)[0];

                // whether it belongs to fileTypes
                let isFileTypes = false;
                if(fileTypes && fileTypes.length > 0){
                    fileTypes.forEach(fileType=>{
                        if(fileName.endsWith(fileType)){
                            isFileTypes = true;
                        }
                    })
                }
                
                // whether it belongs to ignored
                let isIgnore = false;
                if(ignores && ignores.length > 0){
                    ignores.forEach(ignore=>{
                        if(componentName.includes(ignore)){
                            isIgnore = true;
                        }
                    })
                }
                
                // whether it needs to be checked
                let needCheck = false;
                if(!isIgnore || isFileTypes){
                    needCheck = true;
                }

                if(needCheck){
                    // check caseType
                    let isCaseChecker = false;
                    if(caseTypes && caseTypes.length > 0){
                        caseTypes.forEach(caseType => {
                            const caseChecker = casing.getChecker(caseType);
                            if(caseChecker(componentName)){
                                isCaseChecker = true;
                            }
                        })
                    }

                    if(!isCaseChecker){
                        context.report({
                            node,
                            messageId: "avoidFileName",
                            data: {
                                name: fileName,
                                types: caseTypes.join(', ')
                            }
                        })
                    }
                }
            }
        }
    }
}