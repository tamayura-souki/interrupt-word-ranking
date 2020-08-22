import React from 'react'
import firebase, {firestore} from 'firebase/app'
import {Label, Form, FormGroup, Input, Button} from 'reactstrap'

import {DBLatestRadioData, WordFormData} from '../config/types'
import {database} from '../config/firebase'
import {WordsConfirm, WordsForm} from '../components/util'

type LatestRadioData = {
  deadline : Date,
  number : Number
}

type AdminFormData = {
  latest : LatestRadioData,
  wordForm : WordFormData,
  wordNumber : number,
  isWordFormActive : boolean
}

export default class AdminForm extends React.Component<{}, AdminFormData> {
  constructor(props:any) {
    super(props)
    this.state = {
      latest : {
        deadline : new Date(),
        number : -1
      },
      wordForm : {
        first: "", second: "", third: ""
      },
      wordNumber : -1,
      isWordFormActive : false
    }
    this.activeForm = this.activeForm.bind(this)
    this.deadlineSubmit = this.deadlineSubmit.bind(this)
    this.wordsSubmit = this.wordsSubmit.bind(this)
  }

  componentDidMount() {
    database.collection("radiodata").doc("latest").get().then(snap => {
      const data = snap.data() as DBLatestRadioData
      if (!data) return
      this.setState({
        latest: {
          deadline : data.deadline.toDate(),
          number : data.number
        }
      })
    })
  }

  activeForm() {
    this.setState({isWordFormActive:true})
  }

  deadlineSubmit(event:React.FormEvent|any){
    event.preventDefault()
    const {number, date, time} = event.target.elements
    if(!(date.value && time.value && number.value)) return

    this.setState({
      latest: {
        deadline : new Date(date.value+" "+time.value),
        number : Number(number.value)
      }
    }, () => (
      database.collection("radiodata").doc("latest").update({
        deadline : firebase.firestore.Timestamp.fromDate(this.state.latest.deadline),
        number : this.state.latest.number
    })))
  }

  async wordsSubmit(event:React.FormEvent|any){
    event.preventDefault()
    const {number, first, second, third} = event.target.elements
    await this.setState({
      wordNumber:(number.value)?(number.value):this.state.wordNumber,
      wordForm : {
        first:(first.value)?(first.value):this.state.wordForm.first,
        second:(second.value)?(second.value):this.state.wordForm.second,
        third:(third.value)?(third.value):this.state.wordForm.third
      },
      isWordFormActive:false
    })
    const doc = database.collection("radiodata").doc(this.state.wordNumber.toString())
    doc.onSnapshot(snap=>{
      if(snap.exists){
        doc.update({
          words : this.state.wordForm
        })
      }else {
        doc.set({
          words : this.state.wordForm
        })
      }
    })
  }

  render() {
    return(
      <>
        これはアドミンフォーム予定地
        <FormGroup onSubmit={this.deadlineSubmit}>
          <Label>締切の設定</Label>
          <Input type="number" name="number" placeholder="第n回"/>
          <Input type="date" name="date" />
          <Input type="time" name="time" />
          <div>
            <Label>内容確認</Label>
            <p>
              第 {this.state.latest.number} 回<br/>
              日付: {this.state.latest.deadline.toString()} <br/>
            </p>
          </div>
          <Button type="submit">設定</Button>
        </FormGroup>
        <FormGroup>
          <Label>正解ワード登録</Label>
          {this.state.isWordFormActive
            ? <Form onSubmit={this.wordsSubmit}>
                <Input type="number" name="number" placeholder="第n回"/>
                <WordsForm/>
                <Button type="submit">確定</Button>
            </Form>
            :<>
              <p>第 {this.state.wordNumber} 回</p>
              <WordsConfirm words={this.state.wordForm}/>
              <Button onClick={this.activeForm}>正解を入力する</Button>
            </>
          }
        </FormGroup>
      </>
    )
  }
}