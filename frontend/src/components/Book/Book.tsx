import { useSortable } from '@dnd-kit/sortable';
import './Book.css';
import { CSS } from '@dnd-kit/utilities';
import Button from '../Button/Button';
import { RiFileCopyLine } from 'react-icons/ri';
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
import { useContext } from 'react';
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

interface BookProps {
  id: number;
  name: string;
  category: 'plans' | 'in-process' | 'finished';
  category_id: number;
  position: number;
}

function Book({ id, name, category, category_id }: BookProps) {
  const { setPlans } = useContext<PlansContextType>(PlansContext);
  const { setInProcess } = useContext<InProgerssContextType>(InProcessContext);
  const { setFinished } = useContext<FinishedContextType>(FinishedContext);

  const { setAlerts } = useContext<AlertContextType>(AlertContext);

  const { categoryIds } =
    useContext<CategoryIdsContextType>(CategoryIdsContext);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const copyText = () => {
    navigator.clipboard.writeText(name);

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
    }, 2500);
  };

  const categories = ['plans', 'in-process', 'finished'];
  categories.splice(
    categories.findIndex((cat) => category === cat),
    1
  );

  const switchCategory = (categoryToSwitch: BookProps['category']) => {
    // Remove from current category
    if (category === 'plans') {
      setPlans((plans: BookProps[]) => plans.filter((b) => b.id !== id));
    } else if (category === 'in-process') {
      setInProcess((inProcess: BookProps[]) =>
        inProcess.filter((b) => b.id !== id)
      );
    } else if (category === 'finished') {
      setFinished((finished: BookProps[]) =>
        finished.filter((b) => b.id !== id)
      );
    }

    // Add to new category
    const newCategoryId = categoryIds[categoryToSwitch];
    const book: BookProps = {
      id,
      name,
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
      <p className='flex items-center justify-center'>{name}</p>
      <div className='flex'>
        <ButtonWithIcon onClick={copyText}>
          <RiFileCopyLine size='1.2rem' />
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
      </div>
    </li>
  );
}

export default Book;
export type { BookProps as BookType };
