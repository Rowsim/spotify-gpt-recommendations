interface DropdownProps {
    dropdownOpen: boolean
    setDropdownOpen: (open: boolean) => void;
    items: {
        label: string;
        value: string;
    }[] | undefined
    dropdownItemsClass?: string;
    onItemClick: (param?: string) => void;
}

export const DropdownButton = ({ dropdownOpen, setDropdownOpen, items, dropdownItemsClass, onItemClick }: DropdownProps) => (
    <>
        <button onBlur={() => setDropdownOpen(false)} onClick={() => setDropdownOpen(!dropdownOpen)} className="inline-flex items-center p-2 text-sm font-medium text-center text-zinc-700 bg-none rounded-lg hover:opacity-50 focus:ring-2 focus:outline-none focus:ring-violet-300" type="button">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </svg>
        </button>

        <div
            className={`${dropdownOpen ? `top-full opacity-100 visible` : 'top-[110%] invisible opacity-0'} ${dropdownItemsClass} absolute z-40 w-72 max-h-[460px] scroll overflow-y-auto rounded bg-zinc-700 transition-all`}>
            {items?.map(item => (
                <button
                    key={item.value}
                    className="block w-full py-2 px-5 text-left sm:text-sm md:text-base text-white hover:bg-zinc-600 hover:bg-opacity-50 hover:text-spotify-green"
                    onClick={() => onItemClick(item.value)}
                >
                    {item.label}
                </button>
            ))}
        </div>
    </>
)