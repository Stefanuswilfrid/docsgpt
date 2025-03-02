import { toast } from "sonner";

export const dismissToast = (id: string) => {
  toast.dismiss(id);
};

export function createSuccessToast(
    message: string,
    {
      id = "toast",
      duration = 5000,
      position = "top-center",
    }: {
      id?: string;
      duration?: number;
      position?: "top-center" | "bottom-center";
    }
  ) {
    toast.custom(
      (_) => {
        return (
          <div className="font-sans mx-auto select-none w-fit bg-slate-100 pointer-events-none rounded-full  whitespace-nowrap py-3 px-6 flex items-center gap-3">
            <div className="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-sky-400 indicator-blue"></div>
            <span className="shrink-0">{message}</span>
          </div>
        );
      },
      {
        id,
        duration,
        position,
        className: "w-full",
      }
    );
  }