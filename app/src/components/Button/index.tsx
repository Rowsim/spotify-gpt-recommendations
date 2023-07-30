import classNames from "classnames";

interface Props {
    text: string;
    customClass?: string;
    solid?: boolean;
    outlineDotted?: boolean;
    iconRight?: string;
    iconRightClass?: string;
    textClass?: string;
    disabled?: boolean;
    showRefresh?: boolean;
    onClick?: () => void;
}

export const Button = ({ text, customClass, solid, outlineDotted, iconRight, iconRightClass, textClass, disabled, showRefresh, onClick }: Props) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={
            classNames('group outline h-12 flex items-center disabled:opacity-50 hover:opacity-60 active:opacity-80 focus:outline-none focus:ring focus:ring-violet-300 px-5 py-2 leading-5 rounded-full text-spotify-green',
                {
                    'bg-spotify-black outline-none': solid,
                    'outline-dotted': outlineDotted,
                    [customClass ?? '']: customClass
                })}
    >
        <p className={`font-bold text-sm md:text-md lg:text-lg ${textClass}`}>
            {text}
        </p>
        {showRefresh ?
            <svg className="h-5 w-5 ml-2 fill-violet-400 group-hover:animate-spin group-focus:animate-spin group-active:animate-spin" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 12v-2l-4 3 4 3v-2h2.997A6.006 6.006 0 0 0 16 8h-2a4 4 0 0 1-3.996 4H7zM9 2H6.003A6.006 6.006 0 0 0 0 8h2a4 4 0 0 1 3.996-4H9v2l4-3-4-3v2z" />
            </svg>
            : null
        }
        {iconRight ?
            <img src={iconRight} alt={`${text}-icon`} className={iconRightClass} />
            : null
        }
    </button>
)