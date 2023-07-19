import { useEffect, useState } from "react";

export default function ButtonLike({myId, card, onCardLike}) {
    const [isLiked, setIsLiked] = useState(false);


    useEffect(() => {
        setIsLiked(card.likes.some(item => myId === item._id))
    }, [card, myId])

    return (
        <>
          <button type="button" className={`element__like ${isLiked ? 'element__like_active' : ""}`} onClick={() => onCardLike(card)} /> 
          <span className="element__counter">{card.likes.length}</span>
        </>
    )
} 