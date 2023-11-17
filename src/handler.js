/* eslint-disable import/no-extraneous-dependencies */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const isEmptyName = name === undefined || name.length <= 0 || name === '';
  if (isEmptyName) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  const isPageError = readPage > pageCount;
  if (isPageError) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount === readPage);

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: newBook.id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let booksWithFilter = [];
  if (name !== undefined) {
    booksWithFilter = books.filter(
      (book) => book.name.toLowerCase().includes(name.toLowerCase()),
    );
    const response = h.response({
      status: 'success',
      data: {
        books: booksWithFilter.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,

        })),
      },
    });
    response.code(200);
    return response;
  } if (reading !== undefined) {
    booksWithFilter = books.filter((book) => book.reading === !!Number(reading));
    const response = h.response({
      status: 'success',
      data: {
        books: booksWithFilter.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,

        })),
      },
    });
    response.code(200);
    return response;
  } if (finished !== undefined) {
    booksWithFilter = books.filter((book) => book.finished === !!Number(finished));
    const response = h.response({
      status: 'success',
      data: {
        books: booksWithFilter.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,

        })),
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,

      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const selectedBook = books.filter((book) => book.id === bookId)[0];

  const book = selectedBook;
  if (selectedBook !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },

    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',

  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const isEmptyName = name === undefined || name.length <= 0 || name === '';
  if (isEmptyName) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  const isPageError = readPage > pageCount;
  if (isPageError) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const updatedAt = new Date().toISOString();
  const selectedBook = books.findIndex((book) => book.id === bookId);

  if (selectedBook === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',

    });
    response.code(404);
    return response;
  }

  books[selectedBook] = {

    ...books[selectedBook],

    name,
    publisher,
    year,
    author,
    summary,
    pageCount,
    readPage,
    reading,
    updatedAt,

  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',

  });
  response.code(200);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',

  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  editBookByIdHandler,
  getBookByIdHandler,
  deleteBookByIdHandler,
};
