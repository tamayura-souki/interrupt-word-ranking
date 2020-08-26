import React from 'react'
import {firestore} from 'firebase/app'
import {Label, Form, FormGroup, Input, Button} from 'reactstrap'

import {DBLatestRadioData, WordFormData} from '../../config/types'
import {database} from '../../config/firebase'
import {WordsConfirm, WordsForm} from '../../components/util'
import {closeWords, scoring, updateRanking} from './admin-func'

type LatestRadioData = {
  deadline : Date,
  number : Number
}

type AdminFormData = {
  latest : LatestRadioData,
  wordForm : WordFormData,
  wordNumber : Number,
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
      const deadline = data.deadline.toDate()
      this.setState({
        latest: {
          deadline : deadline,
          number : data.number
        }
      })
      if(deadline.getTime() < new Date().getTime()) {
        database.collection("radiodata")
          .doc(data.number.toString()).get().then( snap => {
            if(snap.get("summary")) return
            closeWords(this.state.latest.number)
          })
      }
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
        deadline : firestore.Timestamp.fromDate(this.state.latest.deadline),
        number : this.state.latest.number
    })))
  }

  wordsSubmit(event:React.FormEvent|any){
    event.preventDefault()
    const {number, first, second, third} = event.target.elements
    this.setState({
      wordNumber:(number.value)?(number.value):this.state.wordNumber,
      wordForm : {
        first:(first.value)?(first.value):this.state.wordForm.first,
        second:(second.value)?(second.value):this.state.wordForm.second,
        third:(third.value)?(third.value):this.state.wordForm.third
      },
      isWordFormActive:false
    }, () => {
      const n = this.state.wordNumber.toString()
      const doc = database.collection("radiodata").doc(n)
      doc.onSnapshot(async snap=>{
        if(snap.exists){
          await doc.update({
            words : this.state.wordForm
          })
        }else {
          await doc.set({
            words : this.state.wordForm
          })
        }
        scoring(n)
      })
    })
  }

  render() {
    const update = () => updateRanking(this.state.latest.number.toString())
    return(
      <>
        これはアドミンフォーム予定地
        <Form onSubmit={this.deadlineSubmit}>
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
        </Form>
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
        <Button color="danger" onClick={update}>ランキングに反映する</Button>
      </>
    )
  }
}