import './Submit.css';

interface SubmitProps {
  onClick?: () => void;
  className?: string;
  id?: string;
  name?: string;
  value: string;
}

function Submit({ onClick, className, id, name, value }: SubmitProps) {
  return (
    <input
      className={`btn ${className ? className : ''}`}
      onClick={onClick}
      id={id}
      name={name}
      value={value}
      type='submit'
    />
  );
}

export default Submit;
