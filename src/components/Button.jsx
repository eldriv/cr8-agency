import clsx from "clsx";

const Button = ({ id, title, rightIcon, leftIcon, containerClass }) => {
  return (
    <button
      id={id}
      className={clsx(
        "group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full px-7 py-3",
        containerClass
      )}
    >
      {leftIcon}
      <span className="relative inline-block overflow-hidden font-general text-xs uppercase">
        <div className="translate-y-0 transition duration-500 group-hover:-translate-y-full">
          {title}
        </div>
        <div className="absolute top-0 left-0 translate-y-full transition duration-500 group-hover:translate-y-0">
          {title}
        </div>
      </span>
      {rightIcon}
    </button>
  );
};

export default Button;