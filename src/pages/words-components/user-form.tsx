import React from 'react'
import { firestore } from 'firebase/app'
import {Label, Form, Button} from 'reactstrap'

import {DBLatestRadioData, WordFormData} from '../../config/types'
import {database} from '../../config/firebase'
import {WordsConfirm, WordsForm} from '../../components/util'
import NameForm from './name-form'

type UserFormState = {
  wordForm : WordFormData,
  isFormActive : boolean,
  uid : string,
  radioData : DBLatestRadioData
}

type UserFormProps = {
  uid : string
}

export default class UserForm extends React.Component<UserFormProps, UserFormState> {
  constructor(props:UserFormProps) {
    super(props)
    this.state = {
      wordForm : {
        first: "", second: "", third: ""
      },
      isFormActive : false,
      uid : props.uid,
      radioData : {
        deadline: new firestore.Timestamp(0, 0),
        number:-1
      }
    }
    this.activeForm = this.activeForm.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    database.collection("radiodata").doc("latest").get().then(snap => {
      const radiodata = snap.data()
      if(!radiodata) return
      this.setState({
        radioData : radiodata as DBLatestRadioData

      }, () => {
        const wordsDoc = database.collection("users").doc(this.state.uid).collection("latest").doc("words")
        wordsDoc.get().then(snap =>{
          if(!snap.exists){
            wordsDoc.set({})
          }else {
            const wordsData = snap.data()
            if(!wordsData) return
            this.setState({wordForm : wordsData as WordFormData})
          }
        })
      })
    })
  }

  activeForm() {
    this.setState({isFormActive:true})
  }

  handleSubmit(event:React.FormEvent|any){
    event.preventDefault()
    const {first, second, third} = event.target.elements
    this.setState({
      wordForm : {
        first:(first.value)?(first.value):this.state.wordForm.first,
        second:(second.value)?(second.value):this.state.wordForm.second,
        third:(third.value)?(third.value):this.state.wordForm.third
      },
      isFormActive:false
    }, () => {
      database.collection("users").doc(this.state.uid).collection("latest").doc("words").update(
        this.state.wordForm
      ).catch(err =>{
        alert("更新失敗。\n締め切り過ぎてるかFirebaseがやられてる。")
        console.log("Error update words", err)
      })
    })
  }

  render () {
    const formChange = this.state.isFormActive
      ? <Form onSubmit={this.handleSubmit}>
          <WordsForm />
          <Button type="submit">確定</Button>
        </Form>
      : <>
          <WordsConfirm words={this.state.wordForm}/>

          {
            (firestore.Timestamp.now() <= this.state.radioData.deadline)
              ? <Button onClick={this.activeForm}>ワードを予想する</Button>
              : <Button>閉店しました</Button>
          }
        </>

    return(
      <>
        <NameForm uid={this.state.uid}/>
        <Label>第{this.state.radioData.number}回のワードを予想する</Label>
        {formChange}
      </>
    )
  }
}