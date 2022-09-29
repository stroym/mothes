import React, {useEffect, useState} from "react"
import {Button} from "../snov/input/Button"
import {default as FavoriteIcon} from "../../../public/icons/favorite.svg"
import {default as FavoriteFillIcon} from "../../../public/icons/favorite_fill.svg"
import {NoteListItemProps} from "../items/NoteListItem"

const FavoriteButton = ({note}: NoteListItemProps) => {

  const [favorite, setFavorite] = useState(note.favorite)

  useEffect(
    () => {
      setFavorite(note.favorite)
    }, [note]
  )

  return (
    <>
      <Button
        preset="provided" border circular color={note.state?.color}
        onClick={async (e) => {
          e.preventDefault()
          setFavorite(await note.star())
        }}
      >
        {favorite ? <FavoriteFillIcon/> : <FavoriteIcon/>}
      </Button>
    </>
  )

}

export default FavoriteButton