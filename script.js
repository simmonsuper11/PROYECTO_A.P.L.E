//una matriz Para Identificar las Imgs
var cardIds = ['glacier','wheat','market'];
var clickHandlers = ['rotate.zoom(this)','rotate.right()','rotate.left()'];
var sizes = [
  { w: 780, h: 420 },
  { w: 602, h: 324 },
  { w: 602, h: 324 }
];
// Una matriz para cambiarle la opacidad a la imagenes cuando estan por detras
var opacities = [1,0.3,0.3];
// el array que hace las sombras de el frente de las imagenes
var shadows = ['drop-shadow(0 2px 3px rgba(0,0,0,0.5))','none','none'];
// una matriz vacía que se completará con referencias a las tarjetas.
  // las cartas se empujan, se abren, se desplazan y no se desplazan en la matriz
  // para reflejar su posición visual, y esto permite que la interfaz de usuario mantenga
  // todo sincronizado.
var cards = [];
// una matriz que define la posición de desplazamiento desde el centro para cada carta
var offsets = ['0px','50px','-50px'];
// una matriz que aplica un índice z de 2 solo a la tarjeta frontal
var indexes = ['2','1','1'];


// una biblioteca de funciones para manipular el carrusel
var rotate = {
  // cuando la interfaz de usuario requiere girar a la izquierda
  left : function () {
   // extrae el último elemento de la matriz y lo coloca al frente
    cards.unshift(cards.pop());
    // gira el carrusel
    translateX();
  },
  // when the UI calls for rotating right
  right : function () {
    // shift the first item out of the array and put it at the end
    cards.push(cards.shift());
    // rotate the carousel
    translateX();
  },
  // when the user clicks on the front card (el)
  zoom : function (el) {
    // display the hidden lightbox
    lightbox.style.display = 'block';
    // show the image on the card as large as possible
    // in the viewport, with the area around the image
    // represented by a 70% opaque black background
    lightbox.style.background = `rgba(0,0,0,0.7) ${el.style.backgroundImage} center/contain no-repeat fixed`;
  },
  // when the user clicks anywhere in the lightbox, it disappears
  unzoom : function () {
    // hide the lightbox
    lightbox.style.display = 'none';
    // release the resources used by the lightbox
    lightbox.style.background = "none";
  },
  // when the user clicks a carousel indicator circle
  indicatorClick : function (el) {
    // clear all carousel indicator fills, and change the
    // fill of the clicked indicator (el) to white
    rotate.indicatorReset(el);
    // find the current location of the corresponding card
    var location = cards.map(card => card.id).indexOf(el.dataset.card);
    // if desired card's index in the cards array is 2
    if (location == 2) {
      // cycle left through the deck
      rotate.left();
    // if desired card's index in the cards array is 1
    } else if (location == 1) {
      // cycle right through the deck
      rotate.right();
    }
    // do nothing if index is 0, because that means
    // the desired card is already in front
  },
  // functions call this to clear and reset indicators
    // the indicator to be filled in is passed as (el)
  indicatorReset : function (el) {
    // set each indicator's fill to transparent so it appears empty
    // but can still receive click events
    indicators.forEach(indicator => indicator.getElementsByTagName('circle')[0].style.fill = 'transparent');
    // set the fill of the passed element (el) to white
    el.getElementsByTagName('circle')[0].style.fill = '#fff';
  }
}

// rotate the carousel based on the updated cards array
function translateX() {
  // loop through the cards, changing their settings based on their new positions
  for (var card in cards) {
    // set the z-index of the card according to its new position
    cards[card].style.zIndex = `${indexes[card]}`;
    // set the onClick attribute of the card (to zoom, rotate left or rotate right)
    cards[card].setAttribute('onClick',clickHandlers[card]);
    // reposition the card horizontally
    cards[card].style.transform = `translateX(${offsets[card]})`;
    // set the height of the card according to its reposition
    // alternatively, we could scale the card using 'transform: scale(x.x)'
    cards[card].style.height = `${sizes[card].h}px`;
    // make the back cards partially transparent, per comp
    cards[card].style.opacity = `${opacities[card]}`;
    // ensure only the front card gets a shadow, per comp
    cards[card].style.filter = `${shadows[card]}`;
    // si es la tarjeta frontal, agregue la clase frontCard al elemento, de lo contrario, elimine la clase frontCard
      // esto determina qué cursor se muestra cuando el usuario se desplaza sobre una tarjeta
      // si el índice de una tarjeta en la matriz de tarjetas es 0, es el
      // front card y se le agregó la clase frontCard.
      // De lo contrario, la clase frontCard se elimina del elemento
      // Lista de clase.
    (card == 0) ? cards[card].classList.add('frontCard') : cards[card].classList.remove('frontCard');
  }
  // borrar círculos indicadores y marcar el que corresponde a la carta de enfrente
  rotate.indicatorReset(indicators[indicators.map(indicator => indicator.dataset.card).indexOf(cards[0].id)]);
}

// una matriz de las URL de las imágenes
  // haciendo que JS cree los elementos basados ​​en esta matriz, será más fácil
  // modificar este código para utilizar una lista de URL proporcionadas a través de JSON más adelante
var images = [
  'https://images.unsplash.com/photo-1521902276589-86dc36705998?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=dda92378228681e307674dba522c69e9',
  'https://images.unsplash.com/photo-1511192319655-f82fa0dfe8fd?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=f9f1d887df07c7f735b60217b010f8d3',
  'https://images.unsplash.com/photo-1535745719881-e842027f7f78?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=1788ff7c617d8ac44b768bdd173b1742'
];

// recorrer la matriz de URL de imágenes para crear las tarjetas
  // esto podría haberse logrado con menos código utilizando una plantilla
  // literal para crear cada div como una cadena y luego agregar a través de
  // carrusel.innerHTML += cadena, pero esta es la forma correcta de agregar
  // elementos al DOM. Estoy igualmente cómodo de cualquier manera.
images.forEach((image, index) => {
  // inicializa tempEl para mantener el elemento hasta que se agregue
  const tempEl = document.createElement('div');
 // establece la clase en la tarjeta
  tempEl.setAttribute('class','card');
 // dar a la tarjeta una identificación única a la tarjeta
  tempEl.setAttribute('id',cardIds[index]);
  // establece un atributo onClick basado en la posición de la tarjeta
  tempEl.setAttribute('onClick',clickHandlers[index]);
 // establecer la imagen de fondo de la tarjeta
  tempEl.setAttribute('style',`background-image: url(${image});`);
  // inserta una referencia a la tarjeta en la matriz de tarjetas
  cards.push(tempEl);
  // agregar el elemento a su div padre
  carousel.appendChild(tempEl);
});

// TODO: haga que JS cree las imágenes SVG cuando cree las tarjetas,
// en lugar de codificarlos en HTML. esto sera util
// si luego necesitamos acomodar más de 3 imágenes.

// una matriz de los círculos indicadores del carrusel 
var indicators = Array.from(carouselIndicators.children);

// inicializa el posicionamiento/dimensionamiento ciclando el carrusel una tarjeta
translateX();