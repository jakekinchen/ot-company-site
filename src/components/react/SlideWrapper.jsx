
import clsx from 'clsx';

/**
 * SlideWrapper component.
 * @param {Object} props - The component props.
 * @param {number} props.index - The index of the slide.
 * @param {number | null} props.hovering - The index of the currently hovering slide, or null if none.
 * @param {React.ReactNode} props.children - The children to be rendered inside the wrapper.
 */
export default function SlideWrapper(props) {
  return (
    <div
      className={clsx(
        "absolute w-full transition-all duration-300 bg-white dt:w-[485px] rounded-2xl shadow-lg p-2",
        props.hovering === props.index ? "opacity-100" : "opacity-0 pointer-events-none",
        props.hovering === props.index || props.hovering === null
          ? "transform-none"
          : props.hovering > props.index
          ? "-translate-x-24"
          : "translate-x-24"
      )}
    >
      {props.children}
    </div>
  );
}
