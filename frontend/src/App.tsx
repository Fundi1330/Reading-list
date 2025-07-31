import BookList from './components/BookList/BookList';
import { type BookType } from './components/Book/Book';

import './App.css';
import {
  closestCorners,
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useContext, useEffect, useState, type ChangeEvent } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import {
  FinishedContext,
  PlansContext,
  InProcessContext,
  type InProgerssContextType,
  type PlansContextType,
  type FinishedContextType,
} from './context/BooksContext';
import AlertList from './components/AlertList/AlertList';
import Input from './components/Input/Input';
import Submit from './components/Submit/Submit';
import axios, { AxiosError } from 'axios';
import {
  CategoryIdsContext,
  type CategoryIdsContextType,
} from './context/CategoryIdsContext';
import type { AlertType } from './components/Alert/Alert';
import { v4 } from 'uuid';
import { AlertContext, type AlertContextType } from './context/AlertContext';
import { useBookListByCategory } from './hooks/useBookListByCategory';

function App() {
  const { plans, setPlans } = useContext<PlansContextType>(PlansContext);
  const { inProcess, setInProcess } =
    useContext<InProgerssContextType>(InProcessContext);
  const { finished, setFinished } =
    useContext<FinishedContextType>(FinishedContext);
  const { categoryIds, setCategoryIds } =
    useContext<CategoryIdsContextType>(CategoryIdsContext);

  const { getBookListByCategory, getBookListSetterByCategory } =
    useBookListByCategory();

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + '/category_ids/')
      .then((categories) => {
        setCategoryIds(categories.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(import.meta.env.VITE_API_URL + '/books_by_categories/')
      .then((books) => {
        setPlans(books.data.plans);
        setInProcess(books.data['in-process']);
        setFinished(books.data.finished);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getBookPos = (id: Number, books: BookType[]) =>
    books.findIndex((book) => {
      return book.id === id;
    });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over === null || active.id === over.id) return;

    const moveBooksPosition = (books: BookType[]) => {
      const originalPos = getBookPos(active.id as Number, books);
      const newPos = getBookPos(over.id as Number, books);

      if (bookElement == null) return;
      let book = books.find((b) => b.id === over.id);
      if (book == null) return;
      const new_order: { [key: number]: number } = {};
      books = arrayMove(books, originalPos, newPos);
      books.forEach((book, pos) => {
        new_order[book.id] = pos;
      });

      axios
        .patch(import.meta.env.VITE_API_URL + `/books/reorder/`, {
          order: new_order,
        })
        .catch((err) => {
          console.log(err);
        });

      return books;
    };
    const targetElement = event.activatorEvent.target as HTMLElement;
    const bookElement = targetElement.closest('.book') as HTMLElement | null;
    const category = bookElement?.dataset['category'];

    if (category == null) return;
    getBookListSetterByCategory(category as BookType['category'])(
      moveBooksPosition(getBookListByCategory(category as BookType['category']))
    );
  };

  const [text, setText] = useState('');

  const { setAlerts } = useContext<AlertContextType>(AlertContext);

  const handleChange = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setText(target.value);
  };

  const handleSubmit = (value: string) => {
    if (value === '') return;

    const book: BookType = {
      id: 0, // the id is set after the request
      name: value,
      category: 'plans',
      category_id: categoryIds.plans,
      position: plans.length,
    };

    axios
      .post(import.meta.env.VITE_API_URL + '/books/', {
        name: book.name,
        category_id: book.category_id,
        position: book.position,
      })
      .then((resp) => {
        book.id = resp.data.id;
        setPlans((plans: BookType[]) => [...plans, book]);
        setText('');
      })
      .catch((err: AxiosError) => {
        const alert: AlertType = {
          id: v4(),
          children: (err.response?.data as { message?: string })?.message,
          className: 'alert-error',
        };

        setAlerts((alerts: AlertType[]) => [...alerts, alert]);
        setTimeout(() => {
          setAlerts((alerts: AlertType[]) =>
            alerts.filter((a) => {
              return !(a.id === alert.id);
            })
          );
        }, 2000);
      });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 15,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 15,
        delay: 250,
      },
    })
  );

  return (
    <DndContext
      modifiers={[restrictToParentElement]}
      sensors={sensors}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <header className='m-3 p-2'>
        <h1 className='text-5xl'>Reading List</h1>
        <AlertList />
      </header>
      <main className='flex flex-col overflow-hidden'>
        <div>
          <h2 className='text-4xl'>Add book</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className='flex items-center justify-center gap-2'
          >
            <Input
              type='text'
              className='add-book'
              value={text}
              onChange={handleChange}
              placeholder='Type book name here...'
            />
            <Submit
              onClick={() => handleSubmit(text)}
              className='submit-btn'
              value='Add!'
            />
          </form>
        </div>
        <div className='grid-card-container '>
          <div className='grid-card bg-cyan-600'>
            <h3 className='text-3xl'>Plans</h3>
            <BookList books={plans} type='plans'></BookList>
          </div>
          <div className='grid-card bg-orange-600'>
            <h3 className='text-3xl'>In Process</h3>
            <BookList books={inProcess} type='in-process'></BookList>
          </div>
          <div className='grid-card bg-emerald-600'>
            <h3 className='text-3xl'>Finished</h3>
            <BookList books={finished} type='finished'></BookList>
          </div>
        </div>
      </main>
      <footer className='m-3 p-2'>Made by Fundi1330 with ❤️</footer>
    </DndContext>
  );
}

export default App;
