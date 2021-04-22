$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $('#bookShelf').on('click', '.readBook', isReadHandler);
  $('#bookShelf').on('click', '.deleteBook', deleteHandler);
  // TODO - Add code for edit & delete buttons
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isRead}</td>
        <td>
          <button class="readBook" data-id="${books[i].id}">Read Book</button>
        </td>
        <td>
          <button class="deleteBook" data-id="${books[i].id}">Delete Book</button>
        </td>
      </tr>
    `);
  }
}

function isReadHandler(){
  console.log('click');
  bookIsRead($(this).data("id"), "true");
}


function bookIsRead(bookId, isRead){
  $.ajax({
    method: 'PUT',
    url: `/books/isRead/${bookId}`,
    data: {
      boolean: isRead
    }
  })
    .then (function(response){
      refreshBooks();
      console.log('edit book');
    })
    .catch(function(error){
      alert('Error from trying to change read status', error);
    })
}

function deleteHandler(){
  deleteBook($(this).data("id"));
}

function deleteBook(bookId){
  $.ajax({
    method: 'DELETE',
    url: `/books/${bookId}`,
  })
  .then (function (response) {
    refreshBooks();
  })
  .catch(function (error){
    alert('Error with deleting book', error);
  })
}
