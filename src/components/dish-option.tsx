import React from "react";

interface IDishOptionProps {
  isSelected: boolean;
  name: string;
  extra?: number | null;
  dishId: number;
  addOptionToItem: (dishId: number, optionName: string) => void;
  removeOptionFromItem: (dishId: number, optionName: string) => void;
}

export const DishOption: React.FC<IDishOptionProps> = ({
  isSelected,
  name,
  extra = 0,
  addOptionToItem,
  removeOptionFromItem,
  dishId,
}) => {
  const onClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.stopPropagation();
    if (isSelected) {
      return removeOptionFromItem(dishId, name);
    }
    return addOptionToItem(dishId, name);
  };

  return (
    <span
      onClick={onClick}
      className={`flex border items-center ${
        isSelected ? "border-gray-800" : ""
      }`}
    >
      <h6 className="mr-2">{name}</h6>
      {extra && <h6 className="text-sm opacity-75">(${extra})</h6>}
    </span>
  );
};
