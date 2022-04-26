import { evaluate } from 'mathjs'

const buttons = document.querySelectorAll('button')
const screen = document.getElementById('screen') as HTMLDivElement
const lowScreen = document.getElementById('low-screen') as HTMLDivElement

buttons.forEach((item) => {
  item.addEventListener('click', (event) => {
    const button = event.currentTarget as HTMLButtonElement
    if (button.hasAttribute('data-operator')) {
      if (lowScreen.innerText === '0' && button.dataset.operator === '-') {
        lowScreen.textContent = button.innerText
        return
      }
      const lastCharactor = lowScreen.innerText[lowScreen.innerText.length - 1]
      const lastTwoCharactors =
        lowScreen.innerText[lowScreen.innerText.length - 2] + lastCharactor

      if (lastTwoCharactors !== '--' && button.innerText === '-') {
        lowScreen.textContent += button.innerText
        return
      }

      if (
        lastCharactor === '*' ||
        lastCharactor === '/' ||
        lastCharactor === '+' ||
        lastTwoCharactors === '--'
      ) {
        return
      }
      lowScreen.textContent += button.innerText
      return
    }
    if (button.hasAttribute('data-number')) {
      if (lowScreen.textContent != '0') {
        lowScreen.textContent += button.innerText
      } else {
        lowScreen.textContent = button.innerText
      }
      return
    }

    switch (button.dataset.action) {
      case 'AC':
        lowScreen.innerText = '0'
        screen.innerText = ''
        break
      case 'DEL':
        if (lowScreen.innerText != '0') {
          lowScreen.innerText = lowScreen.innerText.slice(
            0,
            lowScreen.innerText.length - 1
          )
        }
        if (lowScreen.innerText === '') {
          lowScreen.innerText = '0'
        }
        break
      case '=':
        try {
          lowScreen.innerText = evaluate(lowScreen.innerText)
          screen.innerText = lowScreen.innerText
        } catch (error) {
          const cache = lowScreen.innerText
          lowScreen.innerText = 'error'
          lowScreen.classList.toggle('error')
          setTimeout(() => {
            lowScreen.innerText = cache
            lowScreen.classList.toggle('error')
          }, 700)
        }
        break
      default:
        console.error('Something went wrong!')
        break
    }
  })
})
