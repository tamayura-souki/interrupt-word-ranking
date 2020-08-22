import React from 'react'
import firebase from 'firebase/app'
import {auth, database} from '../config/firebase'
import AdminForm from './admin-form'
import UserForm from './user-form'

type AdminData = {
	isAdmin: boolean
}

type WordsState = {
	form:React.ReactElement|null,
	uid: string
}

class Words extends React.Component<{}, WordsState> {
	constructor(props:any){
		super(props)
		this.state = {
			form: null,
			uid : ""
		}
	}

	componentDidMount() {
		auth.onAuthStateChanged(user => {
			if(user != null){
				database.collection("admin")
					.doc(user.uid).get().then(snap => {
					const adminData = snap.data() as AdminData
					this.setState({
						form: ( typeof adminData != "undefined" && adminData.isAdmin
							? <AdminForm/>
							: <UserForm uid={user.uid}/>
						),
						uid: user.uid
					})
				})
			} else {
				this.setState({form: null})
			}
		})
	}

	render() {
		return (
			<>
				<h1>words</h1>
				<div className="form">{this.state.form}</div>
			</>
		)
	}
}

export default Words