
class Library {

   #booksList = [];

   getBooksList() {
      return this.booksList;
   }


   addBook(book) {
      this.booksList.push(book);
   }

   removeBook() { }


}

class Book {
   constructor(author, title, genre, pages, read) {
      this.author = author,
         this.title = title,
         this.genre = genre,
         this.pages = pages,
         this.read = read
   }

   changeRead(read) {

   }
}


class databaseController() {

}

class ScreenController() {

   popupOn() { }

   resetTable() {

   }

   renderTable() { }

   sortTable() { }

}