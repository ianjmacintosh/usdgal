
import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('<App />', () => {
  test('correctly converts BRL per liter to USD per gallon', () => {
    render(<App />)

    // Populate price per liter in BRL
    // Hard-coded conversion from BRL to USD: 1 USD = 5.7955874 BRL
    // pricePerLiterInBRL * 3.78541 / 5.7955874 = pricePerGallonInUSD
    // Example: 6.78 * 3.78541 / 5.7955874 = 4.42838284
    // 4.42838284 rounded to 2 places is 4.43

    // Expect price to show correctly in USD
    const input = screen.getByLabelText('Local price (BRL per liter)')
    fireEvent.change(input, {target: {value: '6.78'}})

    // Get output
    const output = screen.getByLabelText('Home price (USD per gallon)')
    // Expect output to be 4.43
    expect(output.value).toBe('4.43')
  })
});
