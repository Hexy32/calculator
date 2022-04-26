import { evaluate } from 'mathjs'

const buttons = document.querySelectorAll('button')
const screen = document.getElementById('screen') as HTMLDivElement
const lowScreen = document.getElementById('low-screen') as HTMLDivElement

document.addEventListener('keypress', (e) => {
  console.log(e.key)
})

buttons.forEach((item) => {
  item.addEventListener('click', (event) => {
    const button = event.currentTarget as HTMLButtonElement
    manangeNumber(button.innerText)
  })
})

function manangeNumber(key: string) {
  //Numbers
  try {
    const keyParsed = JSON.parse(key)

    if (keyParsed <= 9) {
      if (lowScreen.textContent != '0') {
        lowScreen.textContent += key
      } else {
        lowScreen.textContent = key
      }
      return
    }
  } catch (error) {
    if (
      key === '.' &&
      lowScreen.textContent![lowScreen.textContent!.length - 1] != '.'
    ) {
      lowScreen.textContent += key
    }
  }

  //Action Keys
  switch (key) {
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
        evaluate(lowScreen.innerText)
        screen.innerText = lowScreen.innerText
        lowScreen.innerText = evaluate(lowScreen.innerText)
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
      break
  }

  //Operators
  if (key === '*' || key === '/' || key === '-' || key === '+') {
    if (lowScreen.innerText === '0' && key === '-') {
      lowScreen.textContent = key
      return
    }
    const lastCharactor = lowScreen.innerText[lowScreen.innerText.length - 1]
    const lastTwoCharactors =
      lowScreen.innerText[lowScreen.innerText.length - 2] + lastCharactor

    if (lastTwoCharactors !== '--' && key === '-') {
      lowScreen.textContent += key
      return
    }

    if (
      lastCharactor === '*' ||
      lastCharactor === '/' ||
      lastCharactor === '+' ||
      lastTwoCharactors === '--'
    ) {
      lowScreen.innerText = lowScreen.innerText.slice(
        0,
        lowScreen.innerText.length - 1
      )
      lowScreen.textContent += key
      return
    }
    lowScreen.textContent += key
    return
  }
}
