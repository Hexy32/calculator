import { evaluate } from 'mathjs'

const buttons = document.querySelectorAll('button')
const screen = document.getElementById('screen') as HTMLDivElement
const lowScreen = document.getElementById('low-screen') as HTMLDivElement
let ctrlHintEnable = true
let timesPressedConsecutively: number
const hintElement = document.querySelectorAll('.hint')[0] as HTMLParagraphElement

hintElement.children[3].addEventListener('click', () => {
  hintElement.classList.add('removed')
  ctrlHintEnable = false
  localStorage.setItem('ctrlHintEnable', 'n')
})

if (localStorage.getItem('ctrlHintEnable') == 'n') {
  ctrlHintEnable = false
}

document.addEventListener('keydown', e => {
  let adjustedKey: string
  switch (e.key) {
    case 'Enter':
      adjustedKey = '='
      manageInput(adjustedKey)
      break
    case 'Backspace':
      if (e.ctrlKey === true) {
        adjustedKey = 'AC'
        ctrlHintEnable = false
        localStorage.setItem('ctrlHintEnable', 'n')
        hintElement.classList.add('removed')
      } else {
        adjustedKey = 'DEL'
      }
      manageInput(adjustedKey)
      break
    case 'Delete':
      if (e.ctrlKey === true) {
        adjustedKey = 'AC'
        ctrlHintEnable = false
        localStorage.setItem('ctrlHintEnable', 'n')
        hintElement.classList.add('removed')
      } else {
        adjustedKey = 'DEL'
      }
      manageInput(adjustedKey)
      break
    case 'l':
      console.log({ ctrlHintEnable })
      console.log({ timesPressedConcecutivly: timesPressedConsecutively })

      break
    case 'c':
      localStorage.clear
      ctrlHintEnable = true
      console.log('Data cleared.')
      break
    default:
      manageInput(e.key)
  }
  hint(e.key)
})

function hint(buttonPressed: string) {
  if (typeof timesPressedConsecutively !== 'number') {
    timesPressedConsecutively = 0
  }
  if ((buttonPressed === 'Backspace' || buttonPressed === 'Delete') && ctrlHintEnable) {
    timesPressedConsecutively++
  } else {
    timesPressedConsecutively = 0
  }
  if (timesPressedConsecutively >= 3) {
    hintElement.classList.remove('removed')
  }
}

buttons.forEach(item => {
  item.addEventListener('click', event => {
    const button = event.currentTarget as HTMLButtonElement
    manageInput(button.innerText)
  })
})

function manageInput(key: string): void {
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
    if (key === '.' && lowScreen.textContent![lowScreen.textContent!.length - 1] != '.') {
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
        lowScreen.innerText = lowScreen.innerText.slice(0, lowScreen.innerText.length - 1)
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
    const lastTwoCharactors = lowScreen.innerText[lowScreen.innerText.length - 2] + lastCharactor

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
      lowScreen.innerText = lowScreen.innerText.slice(0, lowScreen.innerText.length - 1)
      lowScreen.textContent += key
      return
    }
    lowScreen.textContent += key
    return
  }
}
