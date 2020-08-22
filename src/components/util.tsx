import React from 'react'
import PropTypes from 'prop-types'
import {FormGroup, Input} from 'reactstrap'

import {WordFormData} from '../config/types'

export const WordsForm = () => {
  return (
    <FormGroup>
      <Input name="first"  placeholder="hoge" />
      <Input name="second" placeholder="fuga" />
      <Input name="third"  placeholder="piyo" />
    </FormGroup>
  )
}

export const WordsConfirm = (props:any) => {
  const words = props.words
  return (
    <ul>
      <li>{words.first}</li>
      <li>{words.second}</li>
      <li>{words.third}</li>
    </ul>
  )
}