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

function App() {
  const { plans, setPlans } = useContext<PlansContextType>(PlansContext);
  const { inProcess, setInProcess } =
    useContext<InProgerssContextType>(InProcessContext);
  const { finished, setFinished } =
    useContext<FinishedContextType>(FinishedContext);

  useEffect(() => {
    setPlans([
      {
        id: 1,
        name: 'Hamlet',
        category: 'plans',
      },
      {
        id: 2,
        name: 'City',
        category: 'plans',
      },
      {
        id: 3,
        name: 'Divine Comedy',
        category: 'plans',
      },
    ]);

    setInProcess([
      {
        id: 4,
        name: 'Hamlet',
        category: 'in-process',
      },
      {
        id: 5,
        name: 'City',
        category: 'in-process',
      },
      {
        id: 6,
        name: 'Divine Comedy',
        category: 'in-process',
      },
    ]);
    setFinished([
      {
        id: 7,
        name: 'Hamlet',
        category: 'finished',
      },
      {
        id: 8,
        name: 'City',
        category: 'finished',
      },
      {
        id: 9,
        name: 'Divine Comedy',
        category: 'finished',
      },
    ]);
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

      return arrayMove(books, originalPos, newPos);
    };
    const targetElement = event.activatorEvent.target as HTMLElement;
    const category = targetElement.dataset['category'];

    if (category === 'plans') {
      setPlans(moveBooksPosition(plans));
    } else if (category === 'in-process') {
      setInProcess(moveBooksPosition(inProcess));
    } else {
      setFinished(moveBooksPosition(finished));
    }
  };

  const [text, setText] = useState('');

  const handleChange = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setText(target.value);
  };

  const handleSubmit = (value: string) => {
    if (value === '') return;

    const id = Math.floor(Math.random() * (2000 - 20 + 1) + 20);
    const book: BookType = {
      id: id,
      name: value,
      category: 'plans',
    };
    setText('');
    setPlans((plans: BookType[]) => [...plans, book]);
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
      <main className='flex flex-col min-h-100'>
        <div>
          <h2 className='text-4xl'>Add book</h2>
          <div className='flex items-center justify-center gap-2'>
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
          </div>
        </div>
        <div className='block sm:grid sm:grid-cols-3 h-100 flex-grow-1'>
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
