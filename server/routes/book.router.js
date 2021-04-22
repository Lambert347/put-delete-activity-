const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// Get all books
router.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool.query(queryText).then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
  .catch(error => {
    console.log('error getting books', error);
    res.sendStatus(500);
  });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post('/',  (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;
  pool.query(queryText, [newBook.author, newBook.title])
    .then(result => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status
router.put('/awesome_reads/books/isRead:id', (req, res) => {
  let bookId = req.params.id;
  let read = req.body.isRead
  let sqlText = '';
  if (read === 'true') {
    sqlText = `UPDATE "books" SET "isRead"=true WHERE "id"=$1;`;
  }
  else {
    res.sendStatus(500);
    return;
  }
  pool.query(sqlText, [bookId]).then((resDB) =>{
    res.sendStatus(200);
  }).catch((error) => {
    res.sendStatus(500);
  });
});

router.delete('/books/:id', (req, res) => {
  let reqId = req.params.id;
  console.log('Delete request id', reqId);

  let sqlText = 'DELETE FROM "books" WHERE "id=$1;';
  pool.query(sqlText, [reqId])
      .then((result) => {
        console.log('Book deleted');
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log(`error making database query ${sqlText}`, error)
        res.sendStatus(500);
      })
})



// TODO - DELETE 
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id


module.exports = router;
