import React from 'react';

type ItemMenuProps = {
    image: string;
    title: string;
    price: string;
    item: string;
    edit: boolean;
    onTap?: () => void;
    addToCart?: () => void;
};

export const ItemMenu: React.FC<ItemMenuProps> = ({ image, title, price, item, edit, onTap, addToCart }) => {
    return (
        <div className="rounded-[18px] bg-[#1A1A1A] p-3 text-white">
            <div
                onClick={addToCart}
                className="h-[120px] w-full cursor-pointer rounded-[16px] bg-cover bg-center md:h-[200px]"
                style={{ backgroundImage: `url(${image})` }}
            ></div>

            <div className="mt-1.5 truncate text-sm font-bold">{title}</div>

            <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-orange-500">{price}</span>
                <span className="text-white/60">{item}</span>
            </div>

            {edit && (
                <button onClick={onTap} className="mt-2 w-full rounded-md bg-orange-600 py-1 text-sm text-white hover:bg-orange-700">
                    Edit
                </button>
            )}
        </div>
    );
};
