import React from 'react'
import {Label, Form, Input, Button} from 'reactstrap'
import { database } from '../../config/firebase'

type NameFormState = {
  isFormActive : boolean,
  name : string,
  uid  : string
}

type NameFormProps = {
  uid : string
}

export default class NameForm extends React.Component<NameFormProps, NameFormState> {
  constructor(props:NameFormProps) {
    super(props)

    this.state = {
      isFormActive : false,
      name : "",
      uid : props.uid
    }

    this.activeForm = this.activeForm.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    database.collection("users").doc(this.state.uid).onSnapshot(async snap => {
      const name = await snap.get("name")
      if(!name)return
      this.setState({name: name})
    })
  }

  activeForm(){
    this.setState({isFormActive:true})
  }

  handleSubmit(event:React.FormEvent|any){
    event.preventDefault()
    const {name} = event.target.elements
    this.setState({
      name:(name.value)?name.value:this.state.name
    },()=>{
      database.collection("users").doc(this.state.uid).update({
        name: this.state.name
      })
    })
    this.setState({isFormActive:false})
  }

  render() {
    const form = (this.state.isFormActive)
      ? <Form onSubmit={this.handleSubmit}>
          <Input name="name" placeholder="名前を入れてください"/>
          <Button type="submit">確定</Button>
        </Form>
      : <>
          <h3>{this.state.name}</h3>
          <Button onClick={this.activeForm}>名前を変える</Button>
        </>

    return(
      <div className="NameForm">
        <Label>ランキングに表示される名前</Label>
        {form}
        <br/>
      </div>
    )
  }
}