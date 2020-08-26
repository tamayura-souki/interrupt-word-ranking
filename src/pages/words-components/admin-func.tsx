import React from 'react'
import firebase, {firestore} from 'firebase/app'

import {WordFormData, RankingElm} from '../../config/types'
import {database} from '../../config/firebase'


// その時点で、どんな単語が予想されているかまとめる。
export function closeWords(wordN:Number){
  database.collection("users").get().then(async snap => {
    const summary_map = new Map()
    await Promise.all(snap.docs.map(async doc => {
      const snap = await database.collection("users").doc(doc.id).collection("latest").doc("words").get()
      const data = snap.data()
      if(!data) return
      database.collection("users").doc(doc.id).collection("radiodata").doc(wordN.toString()).set({
        expectedWords:data
      })
      const {first, second, third} = data as WordFormData
      summary_map.set(first, summary_map.has(first)? summary_map.get(first)+1 : 1)
      summary_map.set(second, summary_map.has(second)? summary_map.get(second)+1 : 1)
      summary_map.set(third, summary_map.has(third)? summary_map.get(third)+1 : 1)
    }))
    const summary = new Array()
    summary_map.forEach((value, key) => { summary.push({key:key, value:value}) })
    summary.sort((a, b)=>{
      if(a.value < b.value) return 1
      if(a.value > b.value) return -1
      return 0
    })
    database.collection("radiodata").doc(wordN.toString()).update({
      summary : summary
    })
  })
}

export function scoring(wordN:string){
  database.collection("users").get().then(async snap=>{
    const ranking:Array<RankingElm> = new Array()
    const radiodata = (await database.collection("radiodata").doc(wordN).get()).data()
    if(!radiodata) return
    const {first, second, third} = radiodata.words as WordFormData
    const interruptWord = first
    const intSubWord = [second, third]
    await Promise.all(snap.docs.map(async doc => {
      const profile = (await database.collection("users").doc(doc.id).get()).data()
      if(!profile) return
      const name = profile.name
      const snap = await database.collection("users").doc(doc.id).collection("latest").doc("words").get()
      const data = snap.data() as WordFormData
      if(!data) return
      let score = 0
      Object.values(data).forEach(value=>{
        if(value == interruptWord) score += 3
        if(intSubWord.includes(value)) score++
      })
      ranking.push({uid:doc.id, name:name, score:score})
    }))
    ranking.sort((a,b)=>{
      if(a.score < b.score) return 1
      if(a.score > b.score) return -1
      return 0
    })
    database.collection("ranking").doc(wordN).set({rankingData:ranking})
  })
}

export function updateRanking(wordN:string) {
  database.collection("ranking").get().then(async snap=>{
    const scoreMap = new Map()
    let latestData:Array<RankingElm>|null = []
    await Promise.all(snap.docs.map(async doc => {
      const data = doc.data()
      if(!data) return
      const rankingData:Array<RankingElm> = data.rankingData
      if(doc.id==wordN) latestData = rankingData
      if(doc.id=="latest") return
      rankingData.forEach((v)=>{
        scoreMap.set(v.uid, {
          score: v.score+(scoreMap.has(v.uid)?scoreMap.get(v.uid).score:0),
          name: v.name
          })
      })
    }))
    if(!latestData)return
    latestData.forEach((v)=>{
      scoreMap.set(v.uid, {
        score: scoreMap.get(v.uid).score,
        name: v.name
        })
    })
    const ranking:Array<RankingElm> = new Array()
    scoreMap.forEach((v, k)=>{
      ranking.push({uid:k, name:v.name, score:v.score})
    })
    ranking.sort((a,b)=>{
      if(a.score < b.score) return 1
      if(a.score > b.score) return -1
      return 0
    })
    database.collection("ranking").doc("latest").set({rankingData:ranking})
  })
}