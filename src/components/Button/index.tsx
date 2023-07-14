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
    onClick?: () => void;
}

export const Button = ({ text, customClass, solid, outlineDotted, iconRight, iconRightClass, textClass, disabled, onClick }: Props) => (
    <button onClick={onClick} disabled={disabled} className={
        classNames('group outline h-12 flex items-center disabled:opacity-50 hover:opacity-60 active:opacity-80 focus:outline-none focus:ring focus:ring-violet-300 px-5 py-2 leading-5 rounded-full text-spotify-green',
            {
                'bg-spotify-black outline-none': solid,
                'outline-dotted': outlineDotted,
                [customClass ?? '']: customClass
            })}>
        <p className={`font-bold text-sm md:text-md lg:text-lg ${textClass}`}>
            {text}
        </p>
        {iconRight ?
            <img src={iconRight} alt={`${text}-icon`} className={iconRightClass} />
            : null
        }
    </button>
)