import React from 'react'
import firebase from 'firebase/app'
import {Label, Form, FormGroup, Input, Button} from 'reactstrap'

import {DBLatestRadioData} from '../config/types'
import {database} from '../config/firebase'


type LatestRadioData = {
  deadline : Date,
  number : Number
}

type AdminFormData = {
  latest : LatestRadioData,
  words : {}
}

export default class AdminForm extends React.Component<{}, AdminFormData> {
  constructor(props:any) {
    super(props)
    this.state = {
      latest : {
        deadline : new Date(),
        number : -1
      },
      words : {}
    }
    this.handleSubmit = this.handleSubmit.bind(this)
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

  handleSubmit(event:React.FormEvent|any){
    event.preventDefault()
    const {date, time} = event.target.elements
    this.setState({
      latest: {
        deadline : new Date(date.value+" "+time.value),
        number : this.state.latest.number
      }
    }, () => (
      database.collection("radiodata").doc("latest").update({
        deadline : firebase.firestore.Timestamp.fromDate(this.state.latest.deadline),
        number : this.state.latest.number
    })))
  }

  render() {
    return(
      <Form onSubmit={this.handleSubmit}>
        これはアドミンフォーム予定地
        <FormGroup>
          <Label>締切の設定</Label>
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
      </Form>
    )
  }
}