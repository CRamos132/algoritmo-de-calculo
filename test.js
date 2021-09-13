function checkClosures(expression) {
    const openingRegex = /\(/gi
    const closureRegex = /\)/gi
    const openings = expression.match(openingRegex)?.length
    const closures = expression.match(closureRegex)?.length
    return openings === closures
}

function checkCharacters(expression) {
    const parenthesisAndNumber = /[\(\)0-9]/gi
    const testResult = expression.match(parenthesisAndNumber)
    if(!testResult){
        return false
    }
    return testResult.length > 0
}

function checkOperations(expression) {
    const operators = /[\+\-\*\/^]/gi
    const check = expression.split('')
    const test = check.map((item, index) => {
        const test = operators.test(item)
        if(test){
            const before = ()=>{
                if(!expression[index-1]){
                    return true
                }
                return checkCharacters(expression[index-1])
            }
            const after = ()=>{
                if(!expression[index+1]){
                    return true
                }
                return checkCharacters(expression[index+1])
            }
            const result = before() === true && after() === true
            return result
        }
        return true
    })
    return !test.includes(false)
}

function invalidCalculation() {
    throw new Error('Cálculo inválido')
}

function separateParenthesis(expression){
    const firstClosing = expression.indexOf(')')
    const lastOpening = expression.lastIndexOf('(', firstClosing)
    const block = expression.substr(lastOpening+1, firstClosing-(lastOpening+1))
    const blockResult = findOperation(block)
    const result = expression.replace(`(${block})`, blockResult)
    return String(result)
}

function calculate(value1, value2, operation) {
    const operations = {
        ['^']: (value1, value2) => {
            const result = Math.pow(Number(value1), Number(value2))
            return String(result)
        },
        ['*']: (value1, value2) => {
            const result = Number(value1)*Number(value2)
            return String(result)
        },
        ['/']: (value1, value2) => {
            const result = Number(value1)/Number(value2)
            return String(result)
        },
        ['+']: (value1, value2) => {
            const result = Number(value1)+Number(value2)
            return String(result)
        },
        ['-']: (value1, value2) => {
            const result = Number(value1)-Number(value2)
            return String(result)
        },
    }
    const result = operations[operation](value1, value2)
    return String(result)
}
function findOperation(expression){
    const operationsRegex = /[+*-\/^]/gi
    const numbersRegex = /([0-9]*)/gi
    const numbersArray = expression.split(operationsRegex).filter(item => item)
    const operationsArray = expression.split(numbersRegex).filter(item => item).filter(item => !(parseInt(item) == item))
    if(expression.includes('^')){
        const expressionIndex = operationsArray.indexOf('^')
        const block = `${numbersArray[expressionIndex]}^${numbersArray[expressionIndex+1]}`
        const result = calculate(numbersArray[expressionIndex], numbersArray[expressionIndex+1], '^')
        const expressionWithResolve = expression.replace(block,result)
        return String(expressionWithResolve)
    }
    if(expression.includes('*')){
        const expressionIndex = operationsArray.indexOf('*')
        const block = `${numbersArray[expressionIndex]}*${numbersArray[expressionIndex+1]}`
        const result = calculate(numbersArray[expressionIndex], numbersArray[expressionIndex+1], '*') 
        const expressionWithResolve = expression.replace(block,result)
        return String(expressionWithResolve)
    }
    if(expression.includes('/')){
        const expressionIndex = operationsArray.indexOf('/')
        const block = `${numbersArray[expressionIndex]}/${numbersArray[expressionIndex+1]}`
        if(numbersArray[expressionIndex+1] === '0'){
            throw new Error('Não divida por zero')
        }
        const result = calculate(numbersArray[expressionIndex], numbersArray[expressionIndex+1], '/') 
        const expressionWithResolve = expression.replace(block,result)
        return String(expressionWithResolve)
    }
    if(expression.includes('+')){
        const expressionIndex = operationsArray.indexOf('+')
        const block = `${numbersArray[expressionIndex]}+${numbersArray[expressionIndex+1]}`
        const result = calculate(numbersArray[expressionIndex], numbersArray[expressionIndex+1], '+') 
        const expressionWithResolve = expression.replace(block,result)
        return String(expressionWithResolve)
    }
    if(expression.includes('-')){
        const expressionIndex = operationsArray.indexOf('-')
        const block = `${numbersArray[expressionIndex]}-${numbersArray[expressionIndex+1]}`
        const result = calculate(numbersArray[expressionIndex], numbersArray[expressionIndex+1], '-') 
        const expressionWithResolve = expression.replace(block,result)
        return String(expressionWithResolve)
    }
}

function resolve(expression, resolver) {
    const result = resolver(expression)
    const operationsRegex = /[+*-\/^]/gi
    const numbersArray = result.split(operationsRegex)
    if(numbersArray.length === 1){
        return [result, true]
    }
    return [result, false]
}

function solve(expression) {
    let solving = expression
    let isSolved = false
    while(!isSolved){
        if(solving.includes('(')){
            const result = resolve(solving, separateParenthesis)
            solving = result[0]
            isSolved = result[1]
            if(isSolved){
                return solving
            }
        } else {
            const result = resolve(solving, findOperation)
            solving = result[0]
            isSolved = result[1]
            if(isSolved){
                return solving
            }
        }
    }
}

function validate(expression) {
    const modifiedExpression = `0+${expression}`
    const cleanExpression = modifiedExpression.replace(/ /g,'')
    try{
        if(!checkClosures(cleanExpression)){
            invalidCalculation()
            return
        }
        if(!checkOperations(cleanExpression)){
            invalidCalculation()
            return
        }
        const result = solve(cleanExpression)
        console.log('input -', expression)
        console.log('output -', result)
    } catch (erro) {
        console.log(erro.message)
    }
}

const myArgs = process.argv.slice(2).join('')
validate(myArgs)

// 20min validações
// 20min loop inicial
// 1h15 fazendo o loop rodar
// 1h fazendo os cálculos funcionarem
// 40min atualizando as regex
// 15min regex atualizada
// 5min testando
// 10min limpando
// 10min fixes finais
// 4h15
