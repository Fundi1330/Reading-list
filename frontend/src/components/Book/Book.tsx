import { useSortable } from '@dnd-kit/sortable';
import './Book.css';
import { CSS } from '@dnd-kit/utilities';
import Button from '../Button/Button';
import {
  RiCheckFill,
  RiDeleteBin5Line,
  RiFileCopyLine,
  RiPencilLine,
} from 'react-icons/ri';
import Dropdown from '../Dropdown/Dropdown';
import DropdownItem from '../DropdownItem/DropdownItem';
import {
  FinishedContext,
  PlansContext,
  InProcessContext,
  type PlansContextType,
  type InProgerssContextType,
  type FinishedContextType,
} from '../../context/BooksContext';
import { useContext, useState, type ChangeEvent } from 'react';
import {
  AlertContext,
  type AlertContextType,
} from '../../context/AlertContext';
import type { AlertType } from '../Alert/Alert';
import { v4 } from 'uuid';
import IconButton from '../IconButton/IconButton';
import axios from 'axios';
import config from '../../config.json';
import {
  CategoryIdsContext,
  type CategoryIdsContextType,
} from '../../context/CategoryIdsContext';
import { useBookListByCategory } from '../../hooks/useBookListByCategory';
import Input from '../Input/Input';

interface BookProps {
  id: number;
  name: string;
  category: 'plans' | 'in-process' | 'finished';
  category_id: number;
  position: number;
}

function Book({ id, name, category, category_id, position }: BookProps) {
  const { setPlans } = useContext<PlansContextType>(PlansContext);
  const { setInProcess } = useContext<InProgerssContextType>(InProcessContext);
  const { setFinished } = useContext<FinishedContextType>(FinishedContext);

  const { setAlerts } = useContext<AlertContextType>(AlertContext);

  const { categoryIds } =
    useContext<CategoryIdsContextType>(CategoryIdsContext);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const { getBookListSetterByCategory } = useBookListByCategory();

  const [bookName, setBookName] = useState(name);
  const [isEditing, setEditing] = useState(false);
  const [text, setText] = useState(bookName);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const copyText = () => {
    navigator.clipboard.writeText(bookName);

    const alert: AlertType = {
      id: v4(),
      children: 'The message was copied to the clipboard!',
      className: 'alert-success',
    };

    setAlerts((alerts: AlertType[]) => [...alerts, alert]);
    setTimeout(() => {
      setAlerts((alerts: AlertType[]) =>
        alerts.filter((a) => {
          return !(a.id === alert.id);
        })
      );
    }, 2000);
  };

  const handleChange = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setText(target.value);
  };

  const saveChanges = () => {
    axios
      .patch(config.API_URL + `/books/${id}/`, {
        name: text,
        category_id: category_id,
        position: position,
      })
      .then(() => {
        setBookName(text);
        setEditing(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteBook = () => {
    axios
      .delete(config.API_URL + `/books/${id}/`)
      .then(() => {
        getBookListSetterByCategory(category as BookProps['category'])(
          (books: BookProps[]) => books.filter((b) => !(b.id === id))
        );

        const alert: AlertType = {
          id: v4(),
          children: 'The book was succesfully deleted!',
          className: 'alert-success',
        };

        setAlerts((alerts: AlertType[]) => [...alerts, alert]);
        setTimeout(() => {
          setAlerts((alerts: AlertType[]) =>
            alerts.filter((a) => {
              return !(a.id === alert.id);
            })
          );
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const categories = ['plans', 'in-process', 'finished'];
  categories.splice(
    categories.findIndex((cat) => category === cat),
    1
  );

  const switchCategory = (categoryToSwitch: BookProps['category']) => {
    // Remove from current category
    getBookListSetterByCategory(category as BookProps['category'])(
      (books: BookProps[]) => books.filter((b) => !(b.id === id))
    );

    // Add to new category
    const newCategoryId = categoryIds[categoryToSwitch];
    const book: BookProps = {
      id,
      name: bookName,
      category: categoryToSwitch,
      category_id: newCategoryId,
      position: 0,
    };

    if (categoryToSwitch === 'plans') {
      setPlans((plans: BookProps[]) => {
        book.position = plans.length;
        return [...plans, book];
      });
    } else if (categoryToSwitch === 'in-process') {
      setInProcess((inProcess: BookProps[]) => {
        book.position = inProcess.length;
        console.log(inProcess);
        return [...inProcess, book];
      });
    } else if (categoryToSwitch === 'finished') {
      setFinished((finished: BookProps[]) => {
        book.position = finished.length;
        return [...finished, book];
      });
    }
    axios
      .patch(config.API_URL + `/books/${id}/`, {
        name: book.name,
        category_id: book.category_id,
        position: book.position,
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const ButtonWithIcon = IconButton(Button);

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className='book cursor-grab'
      data-category={category}
    >
      {isEditing ? (
        <form onSubmit={(e) => e.preventDefault()}>
          <Input
            type='text'
            className='edit-book-name'
            value={text}
            onChange={handleChange}
            placeholder='Type new book name here...'
          />
        </form>
      ) : (
        <p className='flex items-center justify-center'>{bookName}</p>
      )}

      <div className='flex'>
        <div>
          {isEditing ? (
            <ButtonWithIcon onClick={saveChanges}>
              <RiCheckFill size='1.35rem' />
            </ButtonWithIcon>
          ) : (
            <>
              <ButtonWithIcon onClick={copyText}>
                <RiFileCopyLine size='1.35rem' />
              </ButtonWithIcon>
              <ButtonWithIcon onClick={() => setEditing(true)}>
                <RiPencilLine size='1.35rem' />
              </ButtonWithIcon>

              <ButtonWithIcon onClick={deleteBook}>
                <RiDeleteBin5Line size='1.35rem' />
              </ButtonWithIcon>
              <Dropdown
                content={
                  <>
                    {categories.map((category) => (
                      <DropdownItem
                        onClick={() =>
                          switchCategory(category as BookProps['category'])
                        }
                        data-category={category}
                        key={category}
                      >
                        <p>Move to {category}</p>
                      </DropdownItem>
                    ))}
                  </>
                }
              />
            </>
          )}
        </div>
      </div>
    </li>
  );
}

export default Book;
export type { BookProps as BookType };
