import React, {forwardRef, MutableRefObject, useContext, useEffect, useRef, useState} from "react"
import Category from "../../data/model/Category"
import {Button, ToggleButton} from "../snov/input/Button"
import ColorPicker from "../snov/input/ColorPicker"
import ComboBox from "../snov/input/downshift/ComboBox"
import Input from "../snov/input/Input"
import Tag from "../../data/model/Tag"
import AppContext from "../../util/AppContext"
import {FORM} from "../../util/classes"
import {useTheme} from "@emotion/react"
import {useDefaultEmpty} from "../../util/hooks"
import {Titled} from "../../data/model/Base"
import FocusTrap from "focus-trap-react"

interface FormProps extends Omit<React.HTMLProps<HTMLFormElement>, "selected" | "onSubmit"> {
  inputValue?: string
  selected?: Tag
  onSubmit?: () => void
  onCreate?: (newTag: Tag) => void
}

const TagForm = forwardRef<HTMLFormElement, FormProps>(
  function TagForm(
    {
      inputValue,
      onSubmit,
      selected,
      onCreate,
      ...props
    }: FormProps,
    ref: React.Ref<HTMLFormElement>
  ) {

    const theme = useTheme()

    const _ref = ref ? (ref as MutableRefObject<HTMLFormElement>) : useRef<HTMLFormElement>(null)

    const appContext = useContext(AppContext)

    const [tempCategories, , addCategory] = useDefaultEmpty<Category>()

    const [selectedTag, setSelectedTag] = useState<Tag | undefined>()
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>()

    const [tagTitle, setTagTitle] = useState("")
    const [tagColor, setTagColor] = useState("")

    const [categoryColor, setCategoryColor] = useState<string | undefined>()

    const [unify, setUnify] = useState(true)

    const [duplicate, setDuplicate] = useState(true)

    useEffect(
      () => {
        setSelectedTag(selected)
      }, [selected]
    )

    useEffect(
      () => {
        if (selectedTag) {
          setTagTitle(selectedTag.title)
          setTagColor(selectedTag.color)
          setSelectedCategory(selectedTag.category)

          setUnify(selectedTag.color == selectedCategory?.color)
        }
      }, [selectedTag]
    )

    useEffect(
      () => {
        if (selectedCategory) {
          setCategoryColor(selectedCategory.color)
          unify && setTagColor(selectedCategory.color ?? "")
        } else {
          setCategoryColor(undefined)
          setUnify(false)
        }
      }, [selectedCategory]
    )

    useEffect(
      () => {
        setDuplicate(appContext.tags.map(it => it.toString()).includes((selectedCategory?.toColonString() ?? "") + tagTitle))
      }, [tagTitle, selectedCategory]
    )

    useEffect(
      () => {
        unify && setTagColor(categoryColor ?? "")
      }, [unify]
    )

    useEffect(
      () => {
        if (selectedCategory && categoryColor && tempCategories.includes(selectedCategory)) {
          selectedCategory.color = categoryColor
          unify && setTagColor(categoryColor ?? "")
        }
      }, [categoryColor]
    )

    useEffect(
      () => {
        if (inputValue) {
          const [tagName, categoryName] = inputValue.split(":").filter(Boolean).reverse()

          setTagTitle(tagName)

          if (categoryName) {
            selectCategory(categoryName, inputValue.includes("::"))
          }
        }
      }, [inputValue]
    )

    const selectCategory = (categoryTitle: string, uniq = false) => {
      const db = appContext.categories.find(it => it.title == categoryTitle)

      if (!db) {
        const temp = new Category(categoryTitle, "", uniq)
        addCategory(temp)
        setSelectedCategory(temp)
        return temp
      } else {
        setSelectedCategory(db)
        return db
      }
    }

    const getCategoryForSave = async () => {
      if (selectedCategory) {
        return tempCategories.includes(selectedCategory) ? await selectedCategory.save() : selectedCategory
      }
    }

    const isCategoryPresent = () => {
      return selectedCategory && tempCategories.includes(selectedCategory)
    }

    const createTag = async () => {
      return await new Tag(tagTitle, tagColor, (await getCategoryForSave())?.id).save()
    }

    const addTag = async () => {
      await appContext.activeNote?.onTag(await createTag())
    }

    const updateTag = async () => {
      if (selectedTag) {
        await selectedTag.update(tagTitle, tagColor, await getCategoryForSave())
      }
    }

    const canSubmit = (isEdit = false) => {
      const notBlank = tagTitle.isNotBlank() && tagColor.isNotBlank()

      if (isEdit) {
        return selectedTag && notBlank
      } else {
        return !duplicate && notBlank
      }
    }

    return (
      <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true, escapeDeactivates: true}}>
        <form
          {...props} ref={_ref} id="tag-form" className={FORM}
          onSubmit={e => {
            e.preventDefault()
            onSubmit && onSubmit()
          }}
        >
          <ColorPicker
            id="category-color" textColors={theme} disabled={!isCategoryPresent()}
            selected={categoryColor} pick={setCategoryColor}
            options={{includeButton: true, absolute: true}}
          />
          <ComboBox<Category>
            id="category-input" placeholder="Tag Category" itemSort={Titled.compareByTitle} tabIndex={0}
            items={[...tempCategories, ...appContext.categories]}
            onSelect={setSelectedCategory} selected={selectedCategory} addItem={onCreate ? undefined : selectCategory}
            borders={{main: true, dropdown: true}}
          />
          <ToggleButton
            id="category-unique" title="Exclusive" preset="check" circular border disabled={!isCategoryPresent()}
            setState={selectedCategory?.unique}
            getState={unique => {
              if (selectedCategory && tempCategories.includes(selectedCategory)) {
                selectedCategory.unique = unique
              }
            }}
          />
          <ColorPicker
            id="tag-color" pick={setTagColor} selected={tagColor} options={{includeButton: true, absolute: true}}
            textColors={theme} disabled={selectedCategory && unify}
          />
          <Input id="tag-input" placeholder="Tag Title" onValueChange={setTagTitle} defaultValue={tagTitle} border/>
          <ToggleButton
            border title="Unify" preset="check" circular setState={unify} getState={setUnify}
            disabled={!selectedCategory}
          />
          <div className="snovy-form-buttons">
            {
              !onCreate &&
              <>
                <Button
                  id="add-button" value="Create & apply" type="submit" disabled={!canSubmit()} border
                  onClick={async () => await addTag()}
                />
              </>
            }
            {
              onCreate &&
              <>
                <Button
                  id="save-button" value="Save" type="submit" disabled={!canSubmit(true)} border
                  onClick={async () => await updateTag()}
                />
                <Button
                  id="create-button" value="Create" type="submit" disabled={!canSubmit()} border
                  onClick={async () => onCreate(await createTag())}
                />
              </>
            }
          </div>
        </form>
      </FocusTrap>

    )

  })

export default TagForm