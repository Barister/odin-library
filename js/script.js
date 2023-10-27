// let's practice the func to download results from json file to the page

let booksCounter = 1;
let myLibrary = [];
const table = document.querySelector('.page__body');

if (table) {
   loadBooks();
}

async function loadBooks() {
   const response = await fetch("files/books.json", {
      method: "GET"
   });

   if (response.ok) {
      const responseResult = await response.json();

      // console.log(responseResult.books);

      buildBooksList(responseResult.books);
      myLibrary = responseResult.books;
   } else {
      alert("Error while getting to database in books.json");
   }
}

function buildBooksList(books) {



   // console.log('books:', books);

   //const tableLastHeaderTitle = document.querySelector('#last-title');


   // console.log('bookRow:', bookRow);
   // console.log(bootAuthor);

   books.forEach(book => {

      let highlighted = '';
      let selectedRead = '';

      if (book.id % 2 === 0) {
         highlighted = 'body-page__item--highlighted';
      }

      if (book.read === 'no') {
         selectedRead = 'selected';
      }

      const rowTemplate = `
         

            <div class="body-page__item ${highlighted}" data-item="author" id="book-${book.id}">${book.author}</div>
            <div class="body-page__item ${highlighted}" data-item="title" id="book-${book.id}">${book.title}</div>
            <div class="body-page__item ${highlighted}" data-item="genre" id="book-${book.id}">${book.genre}</div>
            <div class="body-page__item body-page--right-align ${highlighted}" data-item="pages" id="book-${book.id}">${book.pages}</div>
            <select class="body-page__item body-page--right-align ${highlighted}" data-item="read" id="book-${book.id}" onchange="changeRead(event)">
               <option value="yes" selected>yes</option>
               <option value="no" ${selectedRead}>no</option>   
               
               ${book.read}
            </select>
            <div class="body-page__item body-page--right-align body-page__item--delete ${highlighted}" id="book-${book.id}"><button title="Delete" onclick="removeBook(event)" data-book="${book.id}">x</button></div>   

        
      `;


      table.insertAdjacentHTML('beforeend', rowTemplate);

      booksCounter = myLibrary.length + 1;

      console.log("booksCounter:", booksCounter);

      // myLibrary.push(book);
   });

}


// let's try to upload new books to json-file

// function saveBooks(books) {
//    const json = JSON.stringify({ books }, null, 2);
// }



// popup On and Off

const popup = document.querySelector('.popup');

function popupOn() {
   popup.classList.add('active');

   if (popup.classList.contains('active')) {

      //console.log('popup class contains active word');

      popup.addEventListener('click', (event) => {

         console.log(event.target.classList.contains('active'));

         if (event.target.classList.contains('active') || event.target.id === 'add-button') {
            popup.classList.remove('active');
         }
      })
   }

}


// submitBook()

function submitBook(event) {

   event.preventDefault();

   //const addButton = document.querySelector('#add-button');
   const authorInput = document.querySelector('#author');
   const titleInput = document.querySelector('#title');
   const genreInput = document.querySelector('#genre');
   const pagesInput = document.querySelector('#pages');
   const readInput = document.querySelector('#read');
   //const tableBody = document.querySelector('.body-page__list');

   const newBook = {
      id: booksCounter,
      author: authorInput.value,
      title: titleInput.value,
      genre: genreInput.value,
      pages: pagesInput.value,
      read: readInput.value
   };

   let bookArray = [];

   bookArray.push(newBook);

   //console.log('bookArray:', bookArray);
   //console.log("booksCounter после добавления книги:", booksCounter);

   buildBooksList(bookArray);

   bookArray = [];

   myLibrary.push(newBook);

   console.log('bookArray после обнуления:', bookArray);
}



// change read option in myLibrary item

function changeRead(event) {
   //console.log(event.target.value);


   let changedId = event.target.id.match(/\d+/)[0];

   //console.log('changedId:', changedId);

   myLibrary.forEach(book => {

      //console.log('book.id:', book.id)

      if (changedId == book.id) {
         //console.log('changedId === book.id:', changedId == book.id)
         book.read = event.target.value;
      }
   })

   console.log('updated myLibrary after changeRead:', myLibrary);


}


// let's try to remove chosen book

function removeBook(event) {
   console.log('removeBook:', event.target.dataset.book);

   console.log('updated myLibrary before removeBook:', myLibrary);

   myLibrary = myLibrary.filter(book => {
      if (event.target.dataset.book != book.id) {

         //console.log('работа filter():', book);

         return book;
      }
   });

   console.log('updated myLibrary after removeBook:', myLibrary);


   resetTable();

   buildBooksList(myLibrary);

}


// reset table

function resetTable() {
   const currentTable = table.querySelectorAll('[id^="book-"]');

   //console.log(currentTable);
   currentTable.forEach(element => {
      element.remove();
   })

}


// sorting of books

function sortBooks(value) {
   //console.log('value:', value);




   myLibrary.sort((a, b) => {
      console.log(a[value], b[value]);

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

      console.log(valueA, valueB);

      if (valueA <= valueB) {

         return -1;
      }

   });


   resetTable();

   console.log('updated myLibrary after sortBooks:', myLibrary);

   buildBooksList(myLibrary);

}


// the odin tasks




// function Book(title, author, pages, read) {
//    this.title = title
//    this.author = author
//    this.pages = pages
//    this.read = read

//    this.info = function () {
//       return `${title} by ${author}, ${pages} pages, ${read}`;
//       //return info;

//    }
// }

// function addBookToLibrary() {
//    // do stuff here



//    myLibrary.push()

// }
