
class Library {

   #booksList = [];
   #booksCounter = 5;

   getBooksList() {
      return this.#booksList;
   }

   getBooksCounter() {
      return this.#booksCounter++;
   }

   addBookToLibrary(book) {
      this.#booksList.push(book);
      this.sendBooksListToScreen();
   }

   removeBook(id) {

      this.#booksList = this.#booksList.filter((book) => book.id !== id);

      this.sendBooksListToScreen();
   }

   changeRead(id, read) {

      this.#booksList = this.#booksList.map((book) => {

         if (book.id === id) {
            book.read = read;
         }

         return book;

      });

      this.sendBooksListToScreen();
   }

   sendBooksListToScreen() {
      ScreenController.renderTable(this.#booksList);
   }

   sortBooksList = (event) => {

      const value = event.target.value;

      this.#booksList.sort((a, b) => {

         let valueA;
         let valueB;

         if (typeof a[value] === 'string') {
            valueA = a[value].toLowerCase();
         } else {
            valueA = a[value];
         }

         if (typeof b[value] === 'string') {
            valueB = b[value].toLowerCase();
         } else {
            valueB = b[value];
         }

         if (valueA <= valueB) {

            return -1;
         }

      });

      ScreenController.renderTable(this.#booksList);

   }


}

class Book {
   constructor(id, author, title, genre, pages, read) {
      this.id = id,
         this.author = author,
         this.title = title,
         this.genre = genre,
         this.pages = pages,
         this.read = read
   }

}


class DatabaseController {

   static async loadBooks(library) {
      const response = await fetch("files/books.json", {
         method: "GET"
      });

      if (response.ok) {
         const responseResult = await response.json();

         responseResult.books.map(book => {
            library.addBookToLibrary(book);
         });

         library.getBooksList();

      } else {
         alert('Error while gettin to database on books.json');
      }

   }

}

class ScreenController {

   static init(library) {
      this.cacheDom();
      this.bindEvents(library);
   }


   static cacheDom() {

      const table = document.querySelector('.page__body');
      const currentRenderedBooksList = table.querySelectorAll('[data-book^="book-"]');
      const buttonPopupOn = document.querySelector('.suggest-page__btn');
      const popup = document.querySelector('.popup');
      const sortSelection = document.querySelector('#sort-selection');
      const submitForm = popup.querySelector('.popup__form');

      return {
         table,
         currentRenderedBooksList,
         popup,
         buttonPopupOn,
         sortSelection,
         submitForm
      }
   }


   static bindEvents(library) {

      this.cacheDom().buttonPopupOn.addEventListener('click', (event) => {
         this.cacheDom().submitForm.reset();
         this.popupOn();
      });

      this.cacheDom().sortSelection.addEventListener('change', library.sortBooksList);

      this.cacheDom().submitForm.addEventListener('submit', (event) => {
         this.submitBook(library)
      });

      this.cacheDom().table.addEventListener('click', (event) => {

         this.changeBookProps(library);
      }
      )
   }

   static changeBookProps(library) {

      if (event.target.closest('.body-page__item--delete')) {
         let id = parseInt(event.target.dataset.book);
         library.removeBook(id);
      } else if (event.target.dataset.item === 'read') {
         let changedId = event.target;
         changedId.addEventListener('change', (event) => { library.changeRead(parseInt(event.target.dataset.book.match(/\d+/)[0]), event.target.value) })
            ;
      }
   }

   static popupOn(event) {

      ScreenController.cacheDom().popup.classList.add('active');

      if (ScreenController.cacheDom().popup.classList.contains('active')) {
         ScreenController.cacheDom().popup.addEventListener('click', (event) => {

            if (event.target.classList.contains('active') || event.target.id === 'add-button') {
               ScreenController.cacheDom().popup.classList.remove('active');
            }
         })
      };
   }

   static submitBook(library) {

      event.preventDefault();

      const id = library.getBooksCounter();

      const authorInput = document.querySelector('#author').value;
      const titleInput = document.querySelector('#title').value;
      const genreInput = document.querySelector('#genre').value;
      const pagesInput = document.querySelector('#pages').value;
      const readInput = document.querySelector('#read').value;



      const book = new Book(id, authorInput, titleInput, genreInput, pagesInput, readInput);

      library.addBookToLibrary(book);

   }

   static resetTable() {

      if (ScreenController.cacheDom().currentRenderedBooksList) {
         ScreenController.cacheDom().currentRenderedBooksList.forEach(element => {
            element.remove();
         });
      }
   }

   static renderTable(library) {

      this.resetTable();

      const currentBooksList = library;

      currentBooksList.forEach(book => {

         let selectedRead = '';

         if (book.read === 'no') {
            selectedRead = 'selected';
         }

         const rowTemplate = `
      
            <div class="body-page__item" data-item="author" data-book="book-${book.id}">${book.author}</div>
            <div class="body-page__item" data-item="title" data-book="book-${book.id}">${book.title}</div>
            <div class="body-page__item" data-item="genre" data-book="book-${book.id}">${book.genre}</div>
            <div class="body-page__item body-page--right-align" data-item="pages" data-book="book-${book.id}">${book.pages}</div>
            <select class="body-page__item body-page--right-align" data-item="read" data-book="book-${book.id}" title="Did you read it yet?">
               <option value="yes" selected>yes</option>
               <option value="no" ${selectedRead}>no</option>   
            </select>
            <div class="body-page__item body-page--right-align body-page__item--delete" data-book="book-${book.id}">
               <button title="Delete" data-book="${book.id}">
                  x
               </button>
            </div>   
      
      `

         ScreenController.cacheDom().table.insertAdjacentHTML('beforeend', rowTemplate);

      });
   }
}


document.addEventListener('DOMContentLoaded', () => {
   const library = new Library();

   DatabaseController.loadBooks(library);

   library.getBooksList();

   ScreenController.init(library);
});


