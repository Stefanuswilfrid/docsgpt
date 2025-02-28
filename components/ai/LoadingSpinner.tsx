interface LoadingSpinnerProps {
    message?: string;
    class?: string;
    invert?: boolean;
    thin?: boolean;
  }
  export default function LoadingSpinner(props: LoadingSpinnerProps) {
    return (
      <div
        className={
          "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-12 h-12 z-40 " +
          (props.invert
            ? "bg-[#101010] "
            : "bg-neutral-100 ") +
          " " +
          (props.class ? props.class : "")
        }
      >
        <div
          className={
            "h-full w-full aspect-square rounded-full " +
            (props.invert
              ? "border-white "
              : "border-neutral-[#101010] ") +
            " animate-spin mb-10 " +
            (props.thin ? "border-2" : "border-4")
          }
        >
          <div
            className={
              "w-2/3 h-2/3 absolute z-50 " +
              (props.invert
                ? "bg-[#101010] "
                : "bg-neutral-100 ") +
              " -top-2 -left-2"
            }
          />
        </div>
        {props.message && (
          <p
            className={
              "text-center text-sm absolute truncate left-1/2 -translate-x-1/2 py-1 px-2 rounded-md animate-pulse " +
              (props.invert
                ? "bg-black  text-white"
                : "bg-neutral-100 ")
            }
          >
            {props.message}
          </p>
        )}
      </div>
    )
  }
  