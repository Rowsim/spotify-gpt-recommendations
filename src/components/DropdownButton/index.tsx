interface DropdownProps {
    dropdownOpen: boolean
    setDropdownOpen: (open: boolean) => void;
    items: {
        label: string;
        value: string;
    }[] | undefined
    dropdownItemsClass?: string;
    onItemClick: (param?: string, param2?: string) => void;
    trackUrl: string
}

export const DropdownButton = ({ dropdownOpen, setDropdownOpen, items, dropdownItemsClass, onItemClick, trackUrl }: DropdownProps) => (
    <>
        {/* This isn't great as we hide the dropdown onBlur for the button - 
        it leads to a weird race condition where somtimes you can click the dropdown items
        before they are hidden and sometimes the onClick event does not fire*/}
        <button onBlur={() => setTimeout(() => setDropdownOpen(false), 100)} onClick={() => setDropdownOpen(!dropdownOpen)} className="inline-flex items-center p-2 text-sm font-medium text-center text-zinc-700 bg-none rounded-lg hover:opacity-50 focus:ring-2 focus:outline-none focus:ring-violet-300" type="button">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </svg>
        </button>

        <div
            className={`${dropdownOpen ? `top-full flex-row` : 'hidden'} ${dropdownItemsClass} absolute z-40 w-[50%] md:w-72 max-h-[460px] scroll overflow-y-auto rounded text-white text-sm md:text-base bg-zinc-700 transition-all`}>
            <button
                className="w-full flex py-2 px-5 group hover:bg-zinc-600 hover:bg-opacity-50"
                onClick={() => navigator.clipboard.writeText(trackUrl)}
            >
                <p className="group-hover:text-violet-400 mr-2">Copy song link</p>
                <svg className="w-5 h-5 fill-white group-hover:fill-violet-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.2218 3.32234C15.3697 1.17445 18.8521 1.17445 21 3.32234C23.1479 5.47022 23.1479 8.95263 21 11.1005L17.4645 14.636C15.3166 16.7839 11.8342 16.7839 9.6863 14.636C9.48752 14.4373 9.30713 14.2271 9.14514 14.0075C8.90318 13.6796 8.97098 13.2301 9.25914 12.9419C9.73221 12.4688 10.5662 12.6561 11.0245 13.1435C11.0494 13.1699 11.0747 13.196 11.1005 13.2218C12.4673 14.5887 14.6834 14.5887 16.0503 13.2218L19.5858 9.6863C20.9526 8.31947 20.9526 6.10339 19.5858 4.73655C18.219 3.36972 16.0029 3.36972 14.636 4.73655L13.5754 5.79721C13.1849 6.18774 12.5517 6.18774 12.1612 5.79721C11.7706 5.40669 11.7706 4.77352 12.1612 4.383L13.2218 3.32234Z" />
                    <path d="M6.85787 9.6863C8.90184 7.64233 12.2261 7.60094 14.3494 9.42268C14.7319 9.75083 14.7008 10.3287 14.3444 10.685C13.9253 11.1041 13.2317 11.0404 12.7416 10.707C11.398 9.79292 9.48593 9.88667 8.27209 11.1005L4.73655 14.636C3.36972 16.0029 3.36972 18.219 4.73655 19.5858C6.10339 20.9526 8.31947 20.9526 9.6863 19.5858L10.747 18.5251C11.1375 18.1346 11.7706 18.1346 12.1612 18.5251C12.5517 18.9157 12.5517 19.5488 12.1612 19.9394L11.1005 21C8.95263 23.1479 5.47022 23.1479 3.32234 21C1.17445 18.8521 1.17445 15.3697 3.32234 13.2218L6.85787 9.6863Z" />
                </svg>
            </button>
            <div className="relative flex px-1 items-center mb-1">
                <div className="flex-grow border-t border-zinc-400 border-opacity-60"></div>
            </div>
            <p className="py-2 px-5">Add to playlist:</p>
            {items?.map(item => (
                <button
                    key={item.value}
                    className="w-full py-2 px-5 text-left hover:bg-zinc-600 hover:bg-opacity-50 hover:text-spotify-green"
                    onClick={() => onItemClick(item.value, item.label)}
                >
                    {item.label}
                </button>
            ))}
        </div>
    </>
)
