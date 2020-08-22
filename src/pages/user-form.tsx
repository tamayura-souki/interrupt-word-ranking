import React from 'react'
import firebase, { firestore } from 'firebase/app'
import {Label, Form, FormGroup, Input, Button} from 'reactstrap'

import {DBLatestRadioData} from '../config/types'
import {auth, database} from '../config/firebase'

type WordFormData = {
  first : string,
  second : string,
  third : string
}

type UserFormState = {
  wordForm : WordFormData,
  isFormActive : boolean,
  uid : string,
  radioData : DBLatestRadioData
}

type UserFormProps = {
  uid : string
}

const InputForm = () => {
  return (
    <FormGroup>
      <Input name="first"  placeholder="hoge" />
      <Input name="second" placeholder="fuga" />
      <Input name="third"  placeholder="piyo" />
    </FormGroup>
  )
}

const Confirm = (props:any) => {
  const words = props.words
  return (
    <ul>
      <li>{words.first}</li>
      <li>{words.second}</li>
      <li>{words.third}</li>
    </ul>
  )
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
    database.collection("users").doc(this.state.uid).get().then(async snap =>{
      const radiosnap = await (await database.collection("radiodata").doc("latest").get()).data()
      if(radiosnap){
        this.setState({
          radioData : radiosnap as DBLatestRadioData
        })
      }

      if(!snap.exists){
        database.collection("users").doc(this.state.uid).set(
          {}
        )
        return
      }else {
        const path = new firestore.FieldPath("/"+this.state.radioData.number.toString()+"/words")
        const data = await snap.get(path)
        if(!data) return
        this.setState({
          wordForm : data,
        })
      }
    })
  }

  activeForm() {
    this.setState({isFormActive:true})
  }

  async handleSubmit(event:React.FormEvent|any){
    event.preventDefault()
    const {first, second, third} = event.target.elements
    await this.setState({
      wordForm : {
        first:(first.value)?(first.value):this.state.wordForm.first,
        second:(second.value)?(second.value):this.state.wordForm.second,
        third:(third.value)?(third.value):this.state.wordForm.third
      },
      isFormActive:false
    })
    const path = new firestore.FieldPath("/"+this.state.radioData.number.toString()+"/words")
    database.collection("users").doc(this.state.uid).update(
      path, this.state.wordForm
    )
  }

  render () {
    return(
      <>
        <Label>ワードを予想する</Label>
        {this.state.isFormActive
          ? <Form onSubmit={this.handleSubmit}>
              <InputForm />
              <Button type="submit">確定</Button>
            </Form>
          : <>
              <Confirm words={this.state.wordForm}/>
              {
              (firestore.Timestamp.now() <= this.state.radioData.deadline)
                ? <Button onClick={this.activeForm}>ワードを予想する</Button>
                : <Button>閉店しました</Button>
              }
            </>
        }
      </>
    )
  }
}