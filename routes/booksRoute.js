import express from "express";
import { Book } from "../models/bookModel.js";

const router = express.Router();

router.post('/', async (request, response) => {
  try {
    const { title, author, publishYear, available, returnDate } = request.body;

    if (!title || !author || !publishYear) {
      return response.status(400).send({
        message: 'Send all required fields: title, author, publishYear',
      });
    }

    const newBook = {
      title,
      author,
      publishYear,
      available: available ?? true,
      returnDate: available ? null : returnDate || null,
    };

    const book = await Book.create(newBook);
    return response.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});


router.get('/', async (request, response) => {
    try {
        const books = await Book.find({});

        const mappedBooks = books.map((book) => ({
          ...book._doc,
          available: book.available,
        }));


        return response.status(200).json({
            count : books.length,
            data : books,
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

router.get('/:id', async (request, response) => {
    try {
        const {id} = request.params;
        const book = await Book.findById(id);
        return response.status(200).json({
          ...book._doc,
          available: book.available,
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

router.put('/:id', async (request, response) => {
  try {
    const { title, author, publishYear, available, returnDate } = request.body;

    if (!title || !author || !publishYear) {
      return response.status(400).send({
        message: 'Send all required fields: title, author, publishYear',
      });
    }

    const { id } = request.params;

    const result = await Book.findByIdAndUpdate(
      id,
      { title, author, publishYear, available: available ?? true,
        returnDate: available ? null : returnDate || null, returnDate },
      { new: true }
    );

    if (!result) {
      return response.status(404).json({ message: 'Book not found' });
    }

    return response.status(200).send({ message: 'Book updated', data: result });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});


router.delete('/:id', async (request, response) => {
    try {
        const {id} = request.params;
        const result = await Book.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({message: 'book not found'});
        }

        return response.status(200).send({message: 'book deleted successfully'});

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
}); 

export default router;
