import {Calculator} from '../src/calculator'
import {expect} from 'chai'

describe('calculator', () => {
    it('should initialise with a calculated value of 0', () => {
        let calculator = new Calculator()
        expect(calculator.value).to.equal(0)
    })

    it('should return a result of 5 when performing an addition of 5 immediately after creation', () => {
        let calculator = new Calculator()
        expect(calculator.add(5)).to.equal(5)
    })

    it('should store the result of an addition performed immediately after creation as the new calculated value', () => {
        let calculator = new Calculator()
        calculator.add(9)
        expect(calculator.value).to.equal(9)
    })

    it('should allow multiple additions to be performed, returning the result of the final additon', () => {
        let calculator = new Calculator()
        calculator.add(9)
        calculator.add(2)
        expect(calculator.add(1)).to.equal(12)
    })

    it('should store the result of multiple additions as the new calculated value', () => {
        let calculator = new Calculator()
        calculator.add(5)
        calculator.add(7)
        calculator.add(3)
        expect(calculator.value).to.equal(15)
    })
})