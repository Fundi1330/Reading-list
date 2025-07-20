import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Book, { type BookType } from '../Book/Book';
import './BookList.css';

interface BookListProps {
  type: string;
  books: BookType[];
}

function BookList({ type, books }: BookListProps) {
  const renderBook = (book: BookType) => {
    return (
      <Book
        key={book.id}
        id={book.id}
        name={book.name}
        category={book.category}
      />
    );
  };

  return (
    <ol className={'book-list ' + type}>
      <SortableContext items={books} strategy={verticalListSortingStrategy}>
        {books.map(renderBook)}
      </SortableContext>
    </ol>
  );
}

export type { Book as BookType };
export default BookList;
