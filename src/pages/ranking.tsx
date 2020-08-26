import React from 'react'
import {Table} from 'reactstrap'

import {database} from '../config/firebase'
import {RankingElm} from '../config/types'

type RankingState = {
  rankingData : Array<RankingElm>
}

export default class Ranking extends React.Component<{}, RankingState> {
  constructor(props:any){
    super(props)
    this.state = {
      rankingData:[]
    }
  }

  componentDidMount(){
    database.collection("ranking").doc("latest").get().then(snap=>{
      const data = snap.data()
      if(!data) return
      this.setState({rankingData: data.rankingData as Array<RankingElm>})
    })
  }

  render() {
    const rankingElms = this.state.rankingData.map((v, i) => {
      return (
        <tr key={v.uid}>
          <th scope="row">{i}</th>
          <td>{v.name}</td>
          <td>{v.score}</td>
        </tr>
      )
    })
    return(
      <div className="ranking">
        <h3>現在のランキング</h3>
        <Table striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Point</th>
            </tr>
          </thead>
          <tbody>
            {rankingElms}
          </tbody>
        </Table>
      </div>
    )
  }
}