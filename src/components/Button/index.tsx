import classNames from "classnames";

interface Props {
    text: string;
    customClass?: string;
    solid?: boolean;
    outlineDotted?: boolean;
    iconRight?: string;
    iconRightClass?: string;
    textClass?: string;
    onClick?: () => void;
}

export const Button = ({ text, customClass, solid, outlineDotted, iconRight, iconRightClass, textClass, onClick }: Props) => (
    <button onClick={onClick} className={
        classNames('group outline h-12 flex items-center hover:opacity-50 active:opacity-70 focus:outline-none focus:ring focus:ring-violet-300 px-5 py-2 leading-5 rounded-full text-spotify-green',
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