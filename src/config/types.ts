import { firestore } from "firebase"

export type DBLatestRadioData = {
  deadline : firebase.firestore.Timestamp,
  number : Number
}