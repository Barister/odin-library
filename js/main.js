
class Library {

   #booksList = [];
   #booksCounter = 5;

   getBooksList() {
      //console.log("#booksList:", this.#booksList);
      return this.#booksList;
   }

   getBooksCounter() {
      return this.#booksCounter++;
   }

   addBookToLibrary(book) {
      console.log('book приехала в библиотеку:', book);
      this.#booksList.push(book);
      this.sendBooksListToScreen();
   }

   removeBook(book) {
      this.#booksList.filter((book) => book.id !== this.book.id);
   }

   sendBooksListToScreen() {
      ScreenController.renderTable(this.#booksList);
   }

   sortBooksList = (event) => {

      //console.log('value', event.target.value);

      const value = event.target.value;

      this.#booksList.sort((a, b) => {

         //console.log(a[value], b[value]);

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

         //console.log(valueA, valueB);

         if (valueA <= valueB) {

            return -1;
         }

      });

      console.log('sort клац-клац ', this.#booksList);

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

   changeRead(read) {
      if (this.read !== read) {
         this.read = read;
      }
   }



}


class DatabaseController {

   static async loadBooks(library) {
      const response = await fetch("files/books.json", {
         method: "GET"
      });

      if (response.ok) {
         const responseResult = await response.json();

         //console.log(responseResult.books);

         responseResult.books.map(book => {
            //console.log(book);

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
      const currentRenderedBooksList = table.querySelectorAll('[id^="book-"]');
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
         console.log('form:', this.cacheDom().submitForm);
         this.cacheDom().submitForm.reset();
         this.popupOn();
      });
      this.cacheDom().sortSelection.addEventListener('change', library.sortBooksList);
      this.cacheDom().submitForm.addEventListener('submit', (event) => {
         this.submitBook(library)
      });
      this.cacheDom().table.addEventListener('click', library.removeBook);
   }

   static popupOn(event) {
      //console.log(this);

      ScreenController.cacheDom().popup.classList.add('active');

      if (ScreenController.cacheDom().popup.classList.contains('active')) {
         ScreenController.cacheDom().popup.addEventListener('click', (event) => {

            console.log(event.target.classList.contains('active'));

            if (event.target.classList.contains('active') || event.target.id === 'add-button') {
               ScreenController.cacheDom().popup.classList.remove('active');
            }
         })
      };
   }

   static submitBook(library) {

      // console.log('library:', library);

      event.preventDefault();

      // console.log('event:', event);

      const id = library.getBooksCounter();

      console.log('id', id);

      const authorInput = document.querySelector('#author').value;
      const titleInput = document.querySelector('#title').value;
      const genreInput = document.querySelector('#genre').value;
      const pagesInput = document.querySelector('#pages').value;
      const readInput = document.querySelector('#read').value;



      const book = new Book(id, authorInput, titleInput, genreInput, pagesInput, readInput);

      console.log('book поехала в библиотеку:', book);

      library.addBookToLibrary(book);

   }

   static resetTable() {

      // console.log('currentRenderedBooksList:', ScreenController.cacheDom().currentRenderedBooksList);

      if (ScreenController.cacheDom().currentRenderedBooksList) {
         ScreenController.cacheDom().currentRenderedBooksList.forEach(element => {
            element.remove();
         });
      }
   }

   static renderTable(library) {

      this.resetTable();

      //console.log('library:', library);

      const currentBooksList = library;

      currentBooksList.forEach(book => {

         let selectedRead = '';

         if (book.read === 'no') {
            selectedRead = 'selected';
         }

         const rowTemplate = `
      
            <div class="body-page__item" data-item="author" id="book-${book.id}">${book.author}</div>
            <div class="body-page__item" data-item="title" id="book-${book.id}">${book.title}</div>
            <div class="body-page__item" data-item="genre" id="book-${book.id}">${book.genre}</div>
            <div class="body-page__item body-page--right-align" data-item="pages" id="book-${book.id}">${book.pages}</div>
            <select class="body-page__item body-page--right-align" data-item="read" id="book-${book.id}" onchange="changeRead(event)" title="Did you read it yet?">
               <option value="yes" selected>yes</option>
               <option value="no" ${selectedRead}>no</option>   
            </select>
            <div class="body-page__item body-page--right-align body-page__item--delete" id="book-${book.id}">
               <button title="Delete" data-book="${book.id}" id="delete-book">
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


