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

interface BookProps {
  id: number;
  name: string;
  category: 'plans' | 'in-process' | 'finished';
}

function Book({ id, name, category }: BookProps) {
  const { setPlans } = useContext<PlansContextType>(PlansContext);
  const { setInProcess } = useContext<InProgerssContextType>(InProcessContext);
  const { setFinished } = useContext<FinishedContextType>(FinishedContext);

  const { setAlerts } = useContext<AlertContextType>(AlertContext);

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
    const book: BookProps = {
      id,
      name,
      category: categoryToSwitch,
    };

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
    if (categoryToSwitch === 'plans') {
      setPlans((plans: BookProps[]) => [...plans, book]);
    } else if (categoryToSwitch === 'in-process') {
      setInProcess((inProcess: BookProps[]) => [...inProcess, book]);
    } else if (categoryToSwitch === 'finished') {
      setFinished((finished: BookProps[]) => [...finished, book]);
    }
  };

  const ButtonWithIcon = IconButton(Button);

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className='book'
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
