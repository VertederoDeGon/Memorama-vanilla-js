const DIFICULTAD = {
  insane: 'insane',
  hard: 'hard',
  normal: 'normal',
  easy: 'easy'
}
class Memorama {
  constructor () {
    //properties
    this.totalCards = []
    this.cardsElementAggregator = []
    this.cardsVerifier = []
    this.cardsNumber = 0
    this.attempts = 0
    this.hits = []
    this.blunders = 0
    this.dificultad = DIFICULTAD

    //fetching elements
    this.$generalContainer = document.querySelector('.contenedor-general')
    this.$cardsContainer = document.querySelector('.contenedor-tarjetas')
    this.$blunders = document.querySelector('.error')
    this.$attempts = document.querySelector('.attempts')
    this.$lockScreen = document.querySelector('.pantalla-bloqueada')
    this.$message = document.querySelector('h2.mensaje')
    this.$difficultyScreen = document.querySelector('.choose-difficulty')

    //creating card template
    this.$cardDiv = document.createElement('div')
    this.$cardImg = document.createElement('img')
    this.$cardDiv.appendChild(this.$cardImg)

    //calling methods
    this.events()
  }

  events () {
    window.addEventListener('DOMContentLoaded', () => {
      this.screenLoad()
    })
  }

  async screenLoad () {
    const res = await fetch('../memo.json')
    const data = await res.json()

    if (data && data.length > 0) data.sort(() => Math.random() - 0.5)

    this.totalCards = structuredClone(data)
    this.cardsNumber = this.totalCards.length

    this.$cardDiv.className = 'tarjeta'
    this.$cardImg.className = 'tarjeta-img'
    this.$cardImg.alt = 'imagen memorama'

    this.totalCards.map(card => {
      this.$cardImg.src = card.src
      this.$cardsContainer.appendChild(this.$cardDiv.cloneNode(true))
    })

    this.startGame()
  }

  startGame () {
    this.choosingDiffilcuty()
    const cards = document.querySelectorAll('.tarjeta')
    if (!cards) return

    cards.forEach(card => {
      card.addEventListener('click', e => {
        e.preventDefault()
        if (
          e.target.matches('.tarjeta-img') &&
          e.target.style.display === 'block'
        )
          return

        console.warn('DATA BEFORE PROGRAMMING!')
        console.log({ totalCards: this.totalCards })
        console.log({ blunders: this.blunders })
        console.log({ cardsNumber: this.cardsNumber })

        console.log({ hits: this.hits })
        console.error('DATA AFTER PROCCESS!')
        this.effectCardFlip(e)
        this.cardOnClick(e)
        console.log({ totalCards: this.totalCards })
        console.log({ blunders: this.blunders })
        console.log({ cardsNumber: this.cardsNumber })

        console.log({ hits: this.hits })
      })
    })
  }

  cardOnClick (e) {
    let imgSource = e.target.firstChild.getAttribute('src')
    this.cardsVerifier.push(imgSource)
    let firstCardClicked = e.target
    this.cardsElementAggregator.unshift(firstCardClicked)
    this.compareCards()
  }

  effectCardFlip (e) {
    e.target.style.backgroundImage = 'none'
    e.target.style.backgroundColor = 'white'
    e.target.firstChild.style.display = 'block'
  }

  cardBack (cards) {
    cards.map(card => {
      card.style.background = '#ffffff'
      setTimeout(() => {
        card.style.backgroundImage = 'url(../img/cover.jpg)'
        card.firstChild.style.display = 'none'
      }, 1000)
    })
  }

  fixCardsForSuccessful (correctCards) {
    correctCards.map(card => {
      card.classList.add('acertada')
      this.hits.push(card)
    })
  }

  compareCards () {
    if (this.cardsVerifier.length === 2) {
      if (this.cardsVerifier[0] === this.cardsVerifier[1])
        this.fixCardsForSuccessful(this.cardsElementAggregator)
      else {
        this.cardBack(this.cardsElementAggregator)
        this.$blunders.style.color = '#dd2200'
        setTimeout(() => {
          this.$blunders.style.color = 'black'
        }, 1000)
        this.blunders++
        this.$blunders.querySelector('span').textContent = this.blunders
      }
      this.cardsVerifier.splice(0)
      this.cardsElementAggregator.splice(0)
      console.warn('')
      console.log({ cardsElementAggregator: this.cardsElementAggregator })
      console.log({ cardsVerifier: this.cardsVerifier })
    }
    this.winGame()
    this.loseGame()
  }

  choosingDiffilcuty () {
    const $difficultiesBtn = document.querySelectorAll('.difficulty')
    if (!$difficultiesBtn) return

    const handleDifficulty = e => {
      e.preventDefault()
      switch (e.target.textContent) {
        case 'Easy':
          this.attempts = 25
          break
        case 'Normal':
          this.attempts = 20
          break
        case 'Hard':
          this.attempts = 15
          break
        case 'Insane':
          this.attempts = 10
          break
      }
      this.$difficultyScreen.style.display = 'none'
      this.$attempts.querySelector('span').textContent = this.attempts
    }

    $difficultiesBtn.forEach((btn, order) => {
      console.log(this.dificultad[order])
      this.$difficultyScreen.appendChild(btn)

      btn.addEventListener('click', handleDifficulty)
    })
  }

  winGame () {
    if (this.hits.length === this.cardsNumber) {
      setTimeout(() => {
        this.$lockScreen.style.display = 'block'
        this.$message.textContent = 'Congrats! You won!'
        console.log(this.$lockScreen)
      }, 1000)
      setTimeout(() => {
        location.reload()
      }, 4000)
    }
  }
  loseGame () {
    if (this.blunders === this.attempts) {
      setTimeout(() => {
        this.$lockScreen.style.display = 'block'
        console.log(this.$lockScreen)
      }, 1000)
      setTimeout(() => {
        location.reload()
      }, 4000)
    }
  }
}

new Memorama()
