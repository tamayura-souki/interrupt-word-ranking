import { firestore } from "firebase"

export type DBLatestRadioData = {
  deadline : firebase.firestore.Timestamp,
  number : Number
}

export type WordFormData = {
  first : string,
  second : string,
  third : string
}
