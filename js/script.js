// let's do the func to download results from json file to the page

let booksCounter = 1;
const taskLibrary = [];
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

      buildBooksList(responseResult.books)
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
            <button class="body-page__item body-page--right-align body-page__item--delete ${highlighted}" id="book-${book.id}"><span title="Delete">x</span></button>   

        
      `;


      table.insertAdjacentHTML('beforeend', rowTemplate);

      booksCounter++;

      console.log("booksCounter:", booksCounter);

      taskLibrary.push(book);
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

   myLibrary.push(newBook);

   console.log('myLibrary:', myLibrary);
   console.log("booksCounter после добавления книги:", booksCounter);

   buildBooksList(myLibrary);

   myLibrary = [];
   console.log('myLibrary после обнуления:', myLibrary);
}

// change read option in myLibrary item

function changeRead(event) {
   console.log(event.target.value);


   let changedId = event.target.id.match(/\d+/)[0];

   console.log('changedId:', changedId);

   taskLibrary.forEach(book => {

      console.log('book.id:', book.id)

      if (changedId == book.id) {
         console.log('changedId === book.id:', changedId == book.id)
         book.read = event.target.value;
      }
   })

   console.log('updated taskLibrary:', taskLibrary);

}


// the odin tasks

let myLibrary = [

];


function Book(title, author, pages, read) {
   this.title = title
   this.author = author
   this.pages = pages
   this.read = read

   this.info = function () {
      return `${title} by ${author}, ${pages} pages, ${read}`;
      //return info;

   }
}

// function addBookToLibrary() {
//    // do stuff here



//    myLibrary.push()

// }
