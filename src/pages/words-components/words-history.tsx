import React from 'react'
import {Table} from 'reactstrap'
import {firestore} from 'firebase/app'

import {auth, database } from '../../config/firebase'
import {WordFormData} from '../../config/types'

type WordsHistoryState = {
  radiodata : Array<firestore.QueryDocumentSnapshot>,
  expectedWords : Map<string, WordFormData>
}

export default class WordsHistory extends React.Component<{},WordsHistoryState> {
  constructor(props:any){
    super(props)
    this.state = {
      radiodata : [],
      expectedWords : new Map()
    }
  }
  componentDidMount() {
    database.collection("radiodata").get().then(snap=>{
      const data = snap.docs.map(doc=>{
        if(doc.id==="latest") return null
        return doc
      })
      if(!data) return
      const radiodata = data as Array<firestore.QueryDocumentSnapshot>
      this.setState({
        radiodata : radiodata
      })
    })
    auth.onAuthStateChanged(user => {
      if(user != null){
        let radiodata = new Map()
        database
          .collection("users").doc(user.uid)
          .collection("radiodata").get().then(async snap=>{
          snap.docs.forEach(doc=>{
            if(doc.id==="latest") return
            radiodata.set(doc.id, doc.data().expectedWords)
          })
          this.setState({
            expectedWords : radiodata
          })
        })
      }
    })
  }

  render() {
    const historyElms = this.state.radiodata.map((v) => {
      if(!v)return null
      const data = v.data()
      const {first, second, third} = data.words
      const summary = (data.summary) ? data.summary : []
      const expectedWords = this.state.expectedWords.get(v.id)
      return (
        <tr key={"radio"+v.id}>
          <th scope="row">{v.id}</th>
          <td>
            <h4>{first}</h4>
            <p>{second}<br/>{third}</p>
          </td>
          <td>
            <p>{summary.map((v:any)=>{return(v.key+":"+v.value+",")})}</p>
          </td>
          <td>
            <p>
              {expectedWords?.first}<br/>
              {expectedWords?.second}<br/>
              {expectedWords?.third}
            </p>
          </td>
        </tr>
      )
    })

    return(
      <div className="history">
        <h3>これまでのInterruptRadio</h3>
        <Table striped>
          <thead>
            <tr>
              <th>#</th>
              <th>InterruptWord</th>
              <th>SummaryExpected</th>
              <th>YouExpected</th>
            </tr>
          </thead>
          <tbody>
            {historyElms}
          </tbody>
        </Table>
      </div>
    )
  }
}